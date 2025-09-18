const express = require('express');
const axios = require('axios');
const sha1 = require('js-sha1');
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '192.168.100.136';

// 添加 CORS 支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 添加请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const config = {
  corpId: 'wwf1919aec8ac3a73d',
  corpSecret: '-xZU48E7B2pT3M5rN9WrtSYU09Mzul5lLfLhG8-YAjM',
  host: HOST,
  port: PORT
};

// 静态资源托管
app.use(express.static(path.join(__dirname, 'public')));

// 获取 access_token
async function getAccessToken() {
  try {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.corpId}&corpsecret=${config.corpSecret}`;
    const res = await axios.get(url);
    const data = res.data;
    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error(`获取 access_token 失败: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error('❌ 获取 access_token 失败:', error.message);
    throw error;
  }
}

// 获取 jsapi_ticket
async function getJsapiTicket() {
  try {
    const accessToken = await getAccessToken();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=${accessToken}`
    const res = await axios.get(url);
    const data = res.data;
    if (data.ticket) {
      return data.ticket;
    } else {
      throw new Error(`获取 jsapi_ticket 失败: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error('❌ 获取 jsapi_ticket 失败:', error.message);
    throw error;
  }
}

// 随便生成一段随机字符串，通常 16–32 位即可
function createNonceStr(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

// 前端调用接口：获取签名
app.get('/get-signature', async (req, res) => {
  try {
    if (!req.query.url) {
      return res.status(400).json({ 
        success: false,
        error: '缺少 url 参数' 
      });
    }
    
    const ticket = await getJsapiTicket();
    const noncestr = createNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);
    const url = decodeURIComponent(req.query.url);

    const rawString = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
    const signature = sha1(rawString);
    const result = {
      success: true,
      corpId: config.corpId,
      noncestr,
      timestamp,
      signature,
    };
    
    console.log('✅ 返回签名数据:', result);
    res.json(result);
  } catch (err) {
    console.error('❌ 获取签名失败:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// 全局错误处理
app.use((err, req, res, next) => {
  res.status(500).json({ 
    success: false,
    error: '服务器内部错误',
    message: err.message 
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: '接口不存在',
    path: req.path 
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 企业微信 H5 Demo 服务已启动:`);
  console.log(`   🌐 网络访问: http://${HOST}:${PORT}`);
});
