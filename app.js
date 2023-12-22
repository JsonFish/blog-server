const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
// 导入加密字符串配置文件
const config = require("./config/default");
// 获取用户的详细IP信息
const expressip = require("express-ip");
const expressJWT = require("express-jwt");
// 必须在路由之前配置

const app = express();
app.use(
  expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: ["/api/user/login", "/api/user/register", "/api/user/captcha"], // 请求白名单 ，不需要token
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressip().getIpInfoMiddleware);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
