const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const infoHandle = require("../routes_handle/infoHandle");
router.get("/config", infoHandle.getInfo);
router.put("/config", authentication, infoHandle.updateInfo);
module.exports = router;
