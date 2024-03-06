var express = require("express");
var router = express.Router();
/* GET home page. */
router.get("/homePage", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/userinfo/getinfo", (req, res) => {
  // console.log(req.user);
  res.send({
    code: 200,
    message: "获取用户信息成功",
    data: req.user, //要发送给客户端的用户信息
  });
});
module.exports = router;
