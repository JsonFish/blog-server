const express = require("express");
const router = express.Router();
// 导入对应处理函数
const usersHandle = require("../routes_handle/loginHandle");
// 获取图片验证码
router.get("/imageCaptcha", usersHandle.userCaptcha);
// 用户登录
router.post("/login", usersHandle.userLogin);
// 用户注册
router.post("/register", usersHandle.userSignIn);
// 刷新token
router.post("/refreshToken", usersHandle.userRefreshToken);

module.exports = router;
