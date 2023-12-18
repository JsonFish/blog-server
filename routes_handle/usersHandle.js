// 用户登录注册处理函数
// 数据库
const db = require("../db/connection");
// 密码加盐
const bcrypt = require("bcryptjs");
// 导入加密字符串配置文件
const config = require("../config/default");
// 引入jwt生成token
const jwt = require("jsonwebtoken");
// 登录
exports.userLogin = (req, res) => {
  const userinfo = req.body;
  const sql = `select * from users where email=?`;
  db(sql, userinfo.email, (err, results) => {
    if (err) {
      return res.send({ code: 400, message: err.message });
    }
    // 账号不存在
    if (results.length == 0)
      return res.send({ code: 201, data: "", message: "该邮箱未注册!" });
    if (results.length == 1) {
      // 解密
      const compareResult = bcrypt.compareSync(
        userinfo.password,
        results[0].password
      );
      if (!compareResult) return res.send({ code: 201, message: "密码错误" });
      // 剔除密码和头像进行加密
      const user = { ...results[0], password: "", avatar: "" };
      // 生成 Token 字符串
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: "48h", // token 有效期为 48 个小时
      });
      return res.send({
        code: 200,
        data: {
          token: "Bearer " + tokenStr,
        },
        message: "登录成功",
      });
    }
  });
};
// 注册
exports.userSignIn = (req, res) => {
  const userForm = req.body;
  const sql = `select * from users where email=?`;
  db(sql, userForm.email, (err, results) => {
    if (err) {
      return res.send({ code: 400, data: null, message: err.message });
    }
    if (results.length !== 0) {
      return res.send({ code: 201, data: null, message: "该邮箱已被注册" });
    } else {
      // 验证用户名是否被占用
      const sql2 = `select * from users where username=?`;
      db(sql2, userForm.username, (err, results) => {
        if (err) {
          return res.send({ code: 400, data: null, message: err.message });
        }
        // 用户明被占用
        if (results.length !== 0) {
          return res.send({
            code: 201,
            data: null,
            message: "该用户名已被占用",
          });
        }
        // 生成盐
        let salt = bcrypt.genSaltSync(10); //其中 10 是工作因子，表示计算哈希所需的成本。工作因子越高，计算哈希的成本越高，生成哈希密码时间越长 密码越安全
        const password = bcrypt.hashSync(userForm.password, salt); // 将密码与盐进行哈希加密
        const sql3 = "insert into users set ?";
        console.log(userForm);
        db(
          sql3,
          {
            username: userForm.username,
            email: userForm.email,
            password: password,
            avatar: "public/images/defaultAvatar.png",
            // create_time:userForm.createtime,
            // update_time:userForm.updatetime
          },
          (err, results) => {
            if (err) return res.send({ status: 1, message: err.message });
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
              return res.send({
                code: 201,
                data: null,
                message: "注册用户失败，请稍后再试！",
              });
            }
            // 注册成功
            res.send({ code: 200, message: "注册成功", data: null });
          }
        );
      });
    }
  });
};
