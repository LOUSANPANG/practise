// 入口文件
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";
import "./tools.js";

async function main(){
    const tansport = new StdioServerTransport(); // 创建一个传输通道
    await server.connect(tansport); // 启动 MCP 服务
    // MCP Client 和 MCP Server 是通过流进行通信的
    console.error("天气的服务器已经启动");
}
main();