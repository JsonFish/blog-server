const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const articleHandle = require("../routes_handle/articleHandle");
router.get("/article", articleHandle.getArticleList);
router.post("/article", authentication, articleHandle.addOrUpdateArticle);
router.put("/article", authentication, articleHandle.addOrUpdateArticle);
router.delete("/article", authentication, articleHandle.deleteArticle);
module.exports = router;
