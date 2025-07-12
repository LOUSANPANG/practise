import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";
import "./tools.js"; // 只要 import 一次，就会执行 tool 注册逻辑

// 🏁 启动服务
async function main() {
  // 创建一个 MCP 传输层，使用标准输入输出（stdin/stdout）作为通信通道。
  // 这是 MCP 官方推荐的一种运行机制，便于前端 Client 与后端进程通信。
  const transport = new StdioServerTransport(); // 1. 创建传输通道（标准输入输出）

  // 启动 MCP Server，并挂载在 transport 通道上。
  // Server 会监听传入的 JSON 消息（请求），并返回响应数据。
  await server.connect(transport); // 2. 启动 MCP 服务，监听传入消息

  // MCP 协议使用 stdout 传输数据，因此不能污染 stdout
  // 如果使用 console.log() 打印普通文本，就会把“杂音”混进传输数据中
  console.error("HeFeng Weather MCP Server 已启动"); // 3. 打印启动成功日志（用 error）
}

main().catch((err) => {
  console.error("MCP Server 启动失败：", err); // 4. 启动失败时打印错误信息
  process.exit(1); // 5. 退出进程并返回错误码
});
