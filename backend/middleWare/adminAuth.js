const express = require('express');
const cookieParser = require('cookie-parser'); // 确保已安装

const app = express();

// 必须在所有路由前使用
app.use(cookieParser()); // 这是关键！
const adminAuth = (req, res, next) => {
  
    if (!req.cookies) {
        return res.status(403).json({ error: "Not logged" });
    }

    // 检查 isAdmin 是否为 true
    if (req.cookies.isAdmin == "1") { // Cookie 存储的是字符串，可能需要转换
        next();
       
    }
 
    return res.status(403).json({ error: "Not authored" });
};
module.exports = adminAuth;