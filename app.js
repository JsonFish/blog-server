const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
var session = require("express-session");
const logger = require("morgan");

const indexRouter = require("./routes/index");
// 导入加密字符串配置文件
const config = require("./config/default");
// 获取用户的详细IP信息
const expressip = require("express-ip");
const expressJWT = require("express-jwt");
const webRouter = require("./routes/web");

// 必须在路由之前配置
const app = express();
app.use(webRouter);
app.use(
  expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [
      "/login",
      "/register",
      "/imageCaptcha",
      "/refreshToken",
    ], // 请求白名单 ，不需要token
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("sessiontest"));
app.use(
  session({
    secret: "sessiontest", //与cookieParser中的一致
    resave: true,
    saveUninitialized: true,
  })
); 
// ip
app.use(expressip().getIpInfoMiddleware);
// 静态资源托管
app.use(express.static(path.join(__dirname, "public")));

app.use(indexRouter);

// 捕获404并转发给错误处理程序
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理
app.use(function (err, req, res, next) {
  // 设置局部变量，只在开发过程中提供错误
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // 呈现错误页面 
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
