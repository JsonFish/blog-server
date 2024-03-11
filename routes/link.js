const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const LinkHandle = require("../routes_handle/linkHandle");
router.get("/link", LinkHandle.getLinkList);
router.post("/link", authentication, LinkHandle.addOrUpdateLink);
router.post("/link/accept", authentication, LinkHandle.agreeAccept);
router.put("/link", authentication, LinkHandle.addOrUpdateLink);
router.delete("/link", authentication, LinkHandle.deleteLink);
module.exports = router;
