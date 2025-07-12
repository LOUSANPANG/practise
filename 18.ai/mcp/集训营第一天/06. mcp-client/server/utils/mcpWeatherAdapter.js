// MCP 服务器管理器 - 支持动态配置多个MCP服务器
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const path = require('path');
const fs = require('fs');

class MCPServerManager {
    constructor() {
        this.mcpServers = new Map(); // 存储MCP服务器实例
        this.toolServerMap = new Map(); // 工具名称到服务器名称的映射
        this.isInitialized = false;
    }

    // 读取MCP配置文件
    loadMCPConfig() {
        try {
            const configPath = path.join(__dirname, '../.mcpconfig.json');
            if (!fs.existsSync(configPath)) {
                console.warn('未找到 .mcpconfig.json 文件，将使用默认配置');
                return this.getDefaultConfig();
            }

            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configContent);
            console.log('📋 已加载MCP配置:', Object.keys(config.mcpServers || {}));
            return config;
        } catch (error) {
            console.error('读取MCP配置失败:', error);
            return this.getDefaultConfig();
        }
    }

    // 获取默认配置（向后兼容）
    getDefaultConfig() {
        return {
            mcpServers: {
                "hefeng-weather": {
                    "command": "node",
                    "args": [path.resolve(__dirname, "../../weather-mcp-server/build/index.js")]
                }
            }
        };
    }

    // 初始化所有MCP服务器
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log('🔗 正在初始化MCP服务器...');
            
            const config = this.loadMCPConfig();
            const serverConfigs = config.mcpServers || {};

            // 为每个配置的服务器创建客户端
            for (const [serverName, serverConfig] of Object.entries(serverConfigs)) {
                await this.initializeServer(serverName, serverConfig);
            }

            // 构建工具到服务器的映射
            await this.buildToolServerMap();

            this.isInitialized = true;
            console.log(`已初始化 ${this.mcpServers.size} 个MCP服务器`);
        } catch (error) {
            console.error('MCP服务器初始化失败:', error);
            throw error;
        }
    }

    // 初始化单个MCP服务器
    async initializeServer(serverName, serverConfig) {
        try {
            console.log(`正在连接 ${serverName}...`);

            // 创建传输层
            const transport = new StdioClientTransport({
                command: serverConfig.command,
                args: serverConfig.args,
                options: serverConfig.options || {}
            });

            // 创建客户端
            const client = new Client({
                name: "chat-bot-client",
                version: "1.0.0"
            }, {
                capabilities: {
                    tools: {}
                }
            });

            // 连接到服务器
            await client.connect(transport);

            // 存储服务器实例
            this.mcpServers.set(serverName, {
                client,
                transport,
                config: serverConfig
            });

            console.log(`${serverName} 连接成功`);
        } catch (error) {
            console.error(`${serverName} 连接失败:`, error);
            throw error;
        }
    }

    // 构建工具到服务器的映射
    async buildToolServerMap() {
        this.toolServerMap.clear();

        for (const [serverName, serverInstance] of this.mcpServers.entries()) {
            try {
                const toolsResponse = await serverInstance.client.listTools();
                
                for (const tool of toolsResponse.tools) {
                    if (this.toolServerMap.has(tool.name)) {
                        console.warn(`工具名称冲突: ${tool.name} 已存在于 ${this.toolServerMap.get(tool.name)}, 将被 ${serverName} 覆盖`);
                    }
                    this.toolServerMap.set(tool.name, serverName);
                }
                
                console.log(`${serverName} 提供工具:`, toolsResponse.tools.map(t => t.name));
            } catch (error) {
                console.error(`获取 ${serverName} 工具列表失败:`, error);
            }
        }
    }

    // 获取所有可用工具列表（转换为 DeepSeek Function Calling 格式）
    async getAvailableTools() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const allTools = [];

        for (const [serverName, serverInstance] of this.mcpServers.entries()) {
            try {
                const toolsResponse = await serverInstance.client.listTools();
                
                // 将 MCP 工具格式转换为 DeepSeek Function Calling 格式
                const functionTools = toolsResponse.tools.map(tool => ({
                    type: "function",
                    function: {
                        name: tool.name,
                        description: tool.description,
                        parameters: tool.inputSchema,
                        // 添加服务器标识用于调试
                        _mcpServer: serverName
                    }
                }));

                allTools.push(...functionTools);
            } catch (error) {
                console.error(`获取 ${serverName} 工具列表失败:`, error);
            }
        }

        return allTools;
    }

    // 调用MCP工具
    async callMCPTool(toolName, args) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // 查找工具所属的服务器
            const serverName = this.toolServerMap.get(toolName);
            if (!serverName) {
                throw new Error(`未找到工具 ${toolName} 对应的MCP服务器`);
            }

            const serverInstance = this.mcpServers.get(serverName);
            if (!serverInstance) {
                throw new Error(`MCP服务器 ${serverName} 未初始化`);
            }

            console.log(`调用MCP工具: ${toolName} (来自 ${serverName})`, args);
            
            const result = await serverInstance.client.callTool({
                name: toolName,
                arguments: args
            });

            console.log(`MCP工具调用成功:`, result);
            
            // 将 MCP 响应格式转换为字符串
            if (result.content && result.content.length > 0) {
                return result.content
                    .map(item => item.text || JSON.stringify(item))
                    .join('\n');
            }
            
            return "工具调用成功，但没有返回内容";
        } catch (error) {
            console.error(`MCP工具调用失败 [${toolName}]:`, error);
            throw error;
        }
    }

    // 重新加载配置
    async reloadConfig() {
        console.log('重新加载MCP配置...');
        
        // 清理现有连接
        await this.cleanup();
        
        // 重新初始化
        this.isInitialized = false;
        await this.initialize();
        
        console.log('MCP配置重新加载完成');
    }

    // 获取服务器状态
    getServerStatus() {
        const status = {};
        for (const [serverName, serverInstance] of this.mcpServers.entries()) {
            status[serverName] = {
                connected: !!serverInstance.client,
                config: serverInstance.config
            };
        }
        return status;
    }

    // 清理所有资源
    async cleanup() {
        console.log('正在清理MCP服务器资源...');
        
        for (const [serverName, serverInstance] of this.mcpServers.entries()) {
            try {
                if (serverInstance.client) {
                    await serverInstance.client.close();
                }
                console.log(`${serverName} 资源已清理`);
            } catch (error) {
                console.error(`清理 ${serverName} 资源失败:`, error);
            }
        }
        
        this.mcpServers.clear();
        this.toolServerMap.clear();
        this.isInitialized = false;
        
        console.log('所有MCP服务器资源已清理');
    }
}

// 创建全局实例
const mcpManager = new MCPServerManager();

// 导出函数接口
module.exports = {
    async getAvailableTools() {
        return await mcpManager.getAvailableTools();
    },
    
    async callMCPTool(name, args) {
        return await mcpManager.callMCPTool(name, args);
    },
    
    async reloadConfig() {
        return await mcpManager.reloadConfig();
    },
    
    getServerStatus() {
        return mcpManager.getServerStatus();
    },
    
    async cleanup() {
        return await mcpManager.cleanup();
    }
};

// 进程退出时清理资源
process.on('exit', () => {
    mcpManager.cleanup();
});

process.on('SIGINT', () => {
    mcpManager.cleanup();
    process.exit();
});

process.on('SIGTERM', () => {
    mcpManager.cleanup();
    process.exit();
}); 