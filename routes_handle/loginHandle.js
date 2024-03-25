// 引入图片验证码模块
const captchapng = require("captchapng");
// 数据库
const db = require("../db/connection");
// 密码加盐
const bcrypt = require("bcryptjs");
// 导入加密字符串配置文件
const config = require("../config/default");
// 引入jwt生成token
const jwt = require("jsonwebtoken");
// 邮箱验证码
const nodemailer = require("nodemailer");
// axios
var axios = require("axios");

// 图片验证码
exports.userCaptcha = (req, res) => {
  const code = Math.floor(Math.random() * (9999 - 999 + 1) + 999); //生成随机4位数
  req.session.captcha = code; //保存在session中，便于之后的验证码判断
  const png = new captchapng(120, 40, parseInt(code)); // width,height,numeric captcha
  png.color(255, 255, 255, 0); // First color: background (red, green, blue, alpha)
  png.color(97, 204, 253, 255); // Second color: paint (red, green, blue, alpha)
  const imgbase64 = png.getBase64();
  res.send({
    code: 200,
    data: {
      imageBase64: imgbase64,
    },
    message: "获取成功",
  });
};
// 登录
exports.userLogin = async (req, res) => {
  const userinfo = req.body;
  // 验证码正确
  if (
    (req.session.captcha == userinfo.code &&
    req.session.captcha &&
    userinfo.code) || userinfo.freeCode 
  ) {
    const sql = `select * from users where email=?`;
    db(sql, userinfo.email).then((results) => {
      // fields为连接查询数据库的一些字段;
      // 账号不存在
      if (results.length == 0) {
        return res.send({ code: 201, data: null, message: "该邮箱未注册!" });
      }
      if (results.length == 1) {
        // password解密 相同 compareResult 为 true, 反之为 false
        const compareResult = bcrypt.compareSync(
          userinfo.password,
          results[0].password
        );
        if (compareResult) {
          const { avatar, username } = results[0];
          // 剔除密码和头像进行加密
          const user = { ...results[0], password: "" };
          // 生成 Token 字符串
          const accessToken = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: "2h", // token 有效期为 48 个小时 24h 10s
          });
          const refreshToken = jwt.sign(user, config.refreshTokenjwtSecretKey, {
            expiresIn: "7d",
          });
          return res.send({
            code: 200,
            data: { username, avatar, accessToken, refreshToken },
            message: "登录成功",
          });
        } else {
          res.send({ code: 501, message: "密码错误!", data: null });
        }
      }
    });
  } else {
    res.send({
      code: -1,
      data: null,
      message: "验证码错误",
    });
  }
};
// 注册
exports.userSignIn = async (req, res) => {
  const userForm = req.body;
  const { email, password, code } = userForm;
  if (!email || !password || !code) {
    return res.send({
      code: -1,
      message: "参数错误！",
    });
  }
  const selectSql = `select * from users where email=?`;
  const results = await db(selectSql, email);
  if (results.length !== 0) {
    return res.send({ code: 201, message: "该邮箱已注册!" });
  }
  const sql = "select code from email_code where email = ?";
  // 检测验证码
  db(sql, email).then(async (response) => {
    if (response.length == 0 || code !== response[response.length - 1].code) {
      return res.send({
        code: 2001,
        message: "验证码无效！",
      });
    }
    const username = "用户" + Math.random().toFixed(4).slice(-4);
    let salt = bcrypt.genSaltSync(10); //其中 10 是工作因子，表示计算哈希所需的成本。工作因子越高，计算哈希的成本越高，生成哈希密码时间越长 密码越安全
    // 密码加密
    const bcryptPassword = bcrypt.hashSync(password, salt); // 将密码与盐进行哈希加密
    const ip = req.ipInfo.ip;
    var ipData = JSON.stringify({
      ip,
    });
    const axiosConfig = {
      method: "post",
      url: "https://api.xygeng.cn/openapi/ip/getInfo",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        Accept: "*/*",
        Connection: "keep-alive",
      },
      data: ipData,
    };
    const ipResponse = await axios(axiosConfig);
    let ipAddress;
    if (ipResponse.data.code == 200) {
      ipAddress = ipResponse.data.data.province.slice(0, -1);
    }
    const sql3 = "insert into users set ?";
    const result = await db(sql3, {
      username: username,
      email: email,
      password: bcryptPassword,
      avatar: `${config.baseUrl}/defaultAvatar.png`,
      ip,
      ipAddress,
    });
    // SQL 语句执行成功，但影响行数不为 1
    if (result.affectedRows == 1) {
      return res.send({ code: 200, message: "注册成功" });
      
    }else{
      return res.send({
        code: 201,
        data: null,
        message: "注册失败！",
      });
    }
  });
};
// 刷新token
exports.userRefreshToken = (req, res) => {
  if (req.user) {
    delete req.user.iat;
    delete req.user.exp;
    const userInfo = {
      ...req.user,
      password: "",
      avatar: "",
    };
    const accessToken = jwt.sign(userInfo, config.jwtSecretKey, {
      expiresIn: "2h", // token 有效期为 48 个小时 24h
    });
    const refreshToken = jwt.sign(userInfo, config.refreshTokenjwtSecretKey, {
      expiresIn: "7d",
    });
    return res.send({
      code: 200,
      data: { accessToken, refreshToken },
      message: "token刷新成功",
    });
  }
};
// 邮箱验证码
exports.sendEmail = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.send({
      code: -131,
      message: "邮箱不能为空",
    });
  }
  // const sql = `select * from users where email=?`;
  // const results = await db(sql, email);
  // if (results.length !== 0) {
  //   return res.send({ code: 201, data: {}, message: "该邮箱已注册" });
  // }

  const transporter = nodemailer.createTransport(config.mailconfig);
  const verify = Math.random().toFixed(4).slice(-4); // 随机6位验证码
  transporter.sendMail(
    {
      // 发件人邮箱
      from: "<" + config.mailconfig.auth.user + ">",
      // 邮件标题
      subject: "Json Blog 注册验证码",
      // 目标邮箱
      to: email,
      // 邮件内容
      text:
        "Json Blog 博客注册，本次验证码为：" +
        verify +
        " 请在5分钟内进行注册！ " +
        "如非本人操作，请忽略此邮件，由此给您带来的不便请谅解！",
    },
    (err, data) => {
      if (err) {
        res.send({
          code: -123,
          err,
          message: "该邮箱无效!",
        });
      } else {
        const sql = "insert into email_code set ?";
        db(sql, { email, code: verify }).then((response) => {
          res.send({
            code: 200,
            message: "success",
          });
        });
      }
    }
  );
};
