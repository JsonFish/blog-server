const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const dailyHandle = require("../routes_handle/dialyHandle");
// 日常
router.get("/dynamic", dailyHandle.getDialyList);
router.post("/dynamic", authentication, dailyHandle.addDialy);
router.delete("/dynamic", authentication, dailyHandle.deleteDialy);
module.exports = router;