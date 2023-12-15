// 用户登录注册路由
const express = require("express");
// 路由
const router = express.Router();
// 导入对应处理函数
const userHandler = require("../routes_handle/registration_handle");
// 用户登录
router.post("/user/login", userHandler.userLogin);
// 用户注册
router.post("/user/signin", userHandler.userSignIn);
module.exports = router;
