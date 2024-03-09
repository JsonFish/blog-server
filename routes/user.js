const express = require("express");
// 路由
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
// 处理函数
const usersHandle = require("../routes_handle/userHandle")
router.get("/user", usersHandle.getUserList);
router.put("/user", authentication,usersHandle.updateUserInfo);
router.delete("/user", authentication, usersHandle.dshieldUser);
module.exports = router;