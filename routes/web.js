var express = require("express");
var router = express.Router();
const articleHandle = require("../routes_handle/articleHandle");
const infoHandle = require("../routes_handle/infoHandle");
const dailyHandle = require("../routes_handle/dialyHandle");
router.get("/bloggerInfo", infoHandle.getInfo);
router.get("/articleList", articleHandle.reqGetArticleList);
router.get("/dailyList", dailyHandle.getDialyList);

module.exports = router;
