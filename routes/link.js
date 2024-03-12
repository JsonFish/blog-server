const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const LinkHandle = require("../routes_handle/linkHandle");
router.get("/links", LinkHandle.getLinkList);
router.post("/links", authentication, LinkHandle.addOrUpdateLink);
router.post("/links/agree", authentication, LinkHandle.agreeAccept);
router.put("/links", authentication, LinkHandle.addOrUpdateLink);
router.delete("/links", authentication, LinkHandle.deleteLink);
module.exports = router;
