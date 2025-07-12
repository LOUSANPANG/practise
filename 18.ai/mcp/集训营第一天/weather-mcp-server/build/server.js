import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export const server = new McpServer({
    name: "hefeng-weather", // 服务器的名称
    version: "1.0.0", // 服务器版本号
    capabilities: {
        tools: {}
    }
});
