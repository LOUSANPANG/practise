const HEFENG_API_KEY = "974672f612e349a1a2b7b1d27827e9d4";
// 🌤️ 日期格式化工具
export function formatDate(text) {
    const today = new Date();
    if (text.includes("今天"))
        return today.toISOString().split("T")[0];
    if (text.includes("明天")) {
        const tomorrow = new Date(today.getTime() + 86400000);
        return tomorrow.toISOString().split("T")[0];
    }
    if (text.includes("后天")) {
        const dayAfter = new Date(today.getTime() + 2 * 86400000);
        return dayAfter.toISOString().split("T")[0];
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(text))
        return text;
    return null;
}
// 🌍 获取城市 ID
export async function getCityLocation(city) {
    const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=${HEFENG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === "200" && data.location?.length > 0) {
        return data.location[0].id;
    }
    return null;
}
// 🌦️ 获取天气信息
export async function getWeather(city, date) {
    const dateStr = formatDate(date);
    if (!dateStr) {
        throw new Error(`无法识别日期格式：“${date}”`);
    }
    const locationId = await getCityLocation(city);
    if (!locationId) {
        throw new Error(`无法识别城市：“${city}”`);
    }
    const url = `https://devapi.qweather.com/v7/weather/7d?location=${locationId}&key=${HEFENG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== "200") {
        throw new Error(`天气 API 返回错误：${data.code}`);
    }
    const match = data.daily.find((d) => d.fxDate === dateStr);
    if (!match) {
        throw new Error(`暂无 ${dateStr} 的天气数据`);
    }
    return `📍 ${city}（${dateStr}）天气：${match.textDay}，气温 ${match.tempMin}°C ~ ${match.tempMax}°C`;
}
