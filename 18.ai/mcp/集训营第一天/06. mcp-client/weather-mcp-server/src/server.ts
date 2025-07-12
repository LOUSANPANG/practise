import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// 🚀 MCP Server 实例
export const server = new McpServer({
  name: "hefeng-weather", // 服务器的唯一标识（例如服务名）
  version: "1.0.0", // 服务器版本号
  capabilities: {
    // 能力声明（tools 和 resources）
    tools: {}, // 注册可调用的函数型工具（如：查天气、翻译）
    resources: {}, // 注册可读取的资源（如：天气数据、文件内容）
  },
});
