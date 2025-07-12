// 和风天气 API Key
const HEFENG_API_KEY = process.env.HEFENG_API_KEY;

/**
 * 格式化日期
 * @param {*} text
 * @returns
 */
function formatDate(text) {
    const today = new Date();
  
    // 中文日期格式（优先）
    if (text.includes("今天")) return today.toISOString().split("T")[0];
    if (text.includes("明天")) {
      const tomorrow = new Date(today.getTime() + 86400000);
      return tomorrow.toISOString().split("T")[0];
    }
    if (text.includes("后天")) {
      const dayAfter = new Date(today.getTime() + 2 * 86400000);
      return dayAfter.toISOString().split("T")[0];
    }
  
    // 英文日期格式（兼容性支持）
    if (text.toLowerCase().includes("today")) return today.toISOString().split("T")[0];
    if (text.toLowerCase().includes("tomorrow")) {
      const tomorrow = new Date(today.getTime() + 86400000);
      return tomorrow.toISOString().split("T")[0];
    }
  
    // 直接传入 yyyy-mm-dd 则不处理
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  
    return null; // 暂不识别
  }
  
  /**
   * 获取城市位置
   * @param {*} city
   * @returns
   */
  async function getCityLocation(city) {
    const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(
      city
    )}&key=${HEFENG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
  
    if (data.code === "200" && data.location?.length > 0) {
      return data.location[0].id;
    }
  
    return null;
  }
  
  // 对外接口：获取指定城市和日期的天气信息
  async function getWeather(city, dateText) {
    console.log("🌤️ 天气查询请求 - 城市:", city, "日期:", dateText);
    
    const date = formatDate(dateText);
    if (!date) {
      console.error("❌ 无法识别日期格式:", dateText);
      return `❌ 无法识别日期格式："${dateText}"，请使用"今天"、"明天"或"后天"`;
    }
  
    const locationId = await getCityLocation(city);
    if (!locationId) {
      console.error("❌ 无法识别城市:", city);
      return `❌ 无法识别城市："${city}"`;
    }
  
    try {
      const url = `https://devapi.qweather.com/v7/weather/7d?location=${locationId}&key=${HEFENG_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json(); // 拿到的是一周的天气
  
      if (data.code !== "200") {
        console.error("❌ 天气API返回错误:", data.code);
        return "❌ 获取天气数据失败";
      }
  
      const match = data.daily.find((d) => d.fxDate === date); // 过滤出需要的那一天的天气数据
      if (!match) {
        console.error("❌ 没有找到对应日期的天气数据:", date);
        return `⚠️ 暂无 ${date} 的天气数据`;
      }
  
      const result = `📍 ${city}（${date}）天气：${match.textDay}，气温 ${match.tempMin}°C ~ ${match.tempMax}°C`;
      console.log("✅ 天气查询成功:", result);
      return result;
    } catch (error) {
      console.error("❌ 天气查询异常:", error);
      return "❌ 天气查询服务暂时不可用";
    }
  }
  
  module.exports = { getWeather };
  