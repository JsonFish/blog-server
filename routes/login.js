const express = require("express");
const expressJWT = require("express-jwt");
// 导入加密字符串配置文件
const config = require("../config/default");
const router = express.Router();
// 导入对应处理函数
const usersHandle = require("../routes_handle/loginHandle");
// 获取图片验证码
router.get("/imageCaptcha", usersHandle.userCaptcha);
// 用户登录
router.post("/login", usersHandle.userLogin);
// 用户注册
router.post("/register", usersHandle.userSignIn);
// 邮箱验证码
router.post("/email", usersHandle.sendEmail);
// 刷新token
router.get(
  "/refreshToken",
  expressJWT({
    secret: config.refreshTokenjwtSecretKey,
    algorithms: ["HS256"],
  }),
  usersHandle.userRefreshToken
);

module.exports = router;
