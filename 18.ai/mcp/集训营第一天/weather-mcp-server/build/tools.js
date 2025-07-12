import { z } from "zod";
import { server } from "./server.js";
import { getWeather } from "./helper.js";
// 为MCP服务器注册工具
// 1. 服务器名称    2. 服务器描述   3. 接收的参数   4. 服务器具体做的事情
server.tool("getWeather", "查询指定城市和日期的天气情况", {
    city: z.string().describe("城市名，例如：上海、北京"),
    date: z.string().describe("日期描述，例如：今天、明天、2024-07-01"),
}, async ({ city, date }) => {
    try {
        // 基础防御：空字符串检查
        if (!city.trim() || !date.trim()) {
            return {
                content: [
                    {
                        type: "text",
                        text: "❗城市和日期不能为空，请重新输入。",
                    },
                ],
            };
        }
        // 获取天气数据（内部如失败将抛出异常）
        const result = await getWeather(city, date);
        console.error("远程获取天气数据：", result);
        return {
            content: [
                {
                    type: "text",
                    text: result,
                },
            ],
        };
    }
    catch {
        return {
            content: [
                {
                    type: "text",
                    text: `❌ 获取天气失败`,
                },
            ],
        };
    }
});
