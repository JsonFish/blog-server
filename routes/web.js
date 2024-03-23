// 前台的接口，不许需要token
var express = require("express");
var router = express.Router();
const articleHandle = require("../routes_handle/articleHandle");
const infoHandle = require("../routes_handle/infoHandle");
const dailyHandle = require("../routes_handle/dialyHandle");
const categoryHandle = require("../routes_handle/categoryHandle");
const messageHandle = require("../routes_handle/messageHandle");
// 留言
router.get("/messageList", messageHandle.getMessageList);
// 分类 
router.get("/categoryList", categoryHandle.getCategoryList);
// 文章详情
router.get("/articleInfo", articleHandle.getArticleList);
// 博主信息
router.get("/bloggerInfo", infoHandle.getInfo);
// 文章列表
router.get("/articleList", articleHandle.reqGetArticleList);
// 日常列表
router.get("/dailyList", dailyHandle.getDialyList);

module.exports = router;