const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const messageHandle = require("../routes_handle/messageHandle");
router.get("/message", messageHandle.getMessageList);
router.post("/message", authentication, messageHandle.addMessage);
router.put("/message", authentication, messageHandle.auditMessage);
router.delete("/message", authentication, messageHandle.deleteMessage);
module.exports = router;
