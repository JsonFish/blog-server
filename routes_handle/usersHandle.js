// 用户登录注册处理函数
// 引入图片验证码模块
const svgCaptcha = require("svg-captcha");
// 数据库
const db = require("../db/connection");
// 密码加盐
const bcrypt = require("bcryptjs");
// 导入加密字符串配置文件
const config = require("../config/default");
// 引入jwt生成token
const jwt = require("jsonwebtoken");
// 验证码
exports.userCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4, //长度
    ignoreChars: "0o1il", //排除字符
    noise: 3, //干扰线条数
    width: 120, // 宽度
    height: 40, // 高度
    color: true, // 验证码字符是否有颜色，默认是没有,如果设置了背景颜色，那么默认就是有字符颜色
    background: "#fff", // 背景色 可以自己改
  });
  // 记录验证码文字
  res.type("svg"); //响应类型
  res.send({
    code: 200,
    data: {
      img: captcha.data,
      captcha: captcha.text,
    },
    message: "获取成功",
  });
};
// 登录
exports.userLogin = async (req, res) => {
  const userinfo = req.body;
  const sql = `select * from users where email=?`;
  await db(sql, userinfo.email, (results, fields) => {
    // fields为连接查询数据库的一些字段;

    // 账号不存在
    if (results.length == 0) {
      res.send({ code: 201, data: null, message: "邮箱或密码错误!" });
    }
    if (results.length == 1) {
      // password解密
      const compareResult = bcrypt.compareSync(
        userinfo.password,
        results[0].password
      );
      if (!compareResult)
        res.send({ code: 201, message: "邮箱或密码错误!", data: null });
      // 剔除密码和头像进行加密
      const user = { ...results[0], password: "", avatar: "" };
      // 生成 Token 字符串
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: "24h", // token 有效期为 48 个小时
      });
      res.send({ code: 200, data: { token: tokenStr }, message: "登录成功" });
    }
  });
};
// 注册
exports.userSignIn = (req, res) => {
  const userForm = req.body;
  const sql = `select * from users where email=?`;
  db(sql, userForm.email, (results, fields) => {
    if (results.length !== 0) {
      return res.send({ code: 201, data: null, message: "该邮箱已被注册" });
    } else {
      // 验证用户名是否被占用
      const sql2 = `select * from users where username=?`;
      db(sql2, userForm.username, (results, fields) => {
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
