const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const articleHandle = require("../routes_handle/articleHandle");
// 文章
router.get("/article", articleHandle.getArticleList);
router.post("/article", authentication, articleHandle.addOrUpdateArticle);
router.put("/article", authentication, articleHandle.addOrUpdateArticle);
router.delete("/article", authentication, articleHandle.deleteArticle);
router.put("/article/status", authentication, articleHandle.updateArticleStatus);
// 草稿
router.get("/article/draft", articleHandle.getDraft);
router.post("/article/draft", authentication, articleHandle.saveDraft);
router.put("/article/draft", authentication, articleHandle.saveDraft);
router.delete("/article/draft", authentication, articleHandle.deleteArticle);

module.exports = router;
