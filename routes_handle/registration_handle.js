// 用户登录注册处理函数
// 登录
const DB = require("../db/connection");
exports.userLogin = (req, res) => {
  const userinfo = req.body;
  console.log(userinfo);
  const sql = `select * from users where account=?`;
  DB(sql, userinfo.username, (err, results) => {
    if (err) {
      return res.send({ code: 400, message: err.message });
    }
    // 账号不存在
    if (results.length == 0)
      return res.send({ code: 400, data: "", message: "该账号未注册!",});
    if (results.length == 1) {
      return res.send({
        code: 200,
        data: results[0],
        msg: "获取成功",
      });
    }
  });
};
// 注册
exports.userSignIn = (req, res) => {
  console.log(req.body);
  res.send({
    code: 200,
    data: "error",
    msg: "获取失败",
  });
};
