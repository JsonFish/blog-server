// 用户登录注册路由
const express = require("express");
// 路由
const router = express.Router();
// 导入对应处理函数
const usersHandle = require("../routes_handle/usersHandle");
// 用户登录
router.post("/user/login", usersHandle.userLogin);
// 用户注册
router.post("/user/register", usersHandle.userSignIn);

module.exports = router;
