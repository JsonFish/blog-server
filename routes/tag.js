const express = require("express");
// 路由
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const tagHandle = require("../routes_handle/tagHandle");
router.get("/tag", tagHandle.getTagList);
router.post("/tag", authentication, tagHandle.addOrUpdateTag);
router.put("/tag", authentication, tagHandle.addOrUpdateTag);
router.delete("/tag", authentication, tagHandle.deleteTag);
module.exports = router;
