const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const dailyHandle = require("../routes_handle/dialyHandle");
// 日常
router.get("/daily", dailyHandle.getDialyList);
router.post("/daily", authentication, dailyHandle.addDialy);
router.delete("/daily", authentication, dailyHandle.deleteDialy);
module.exports = router;