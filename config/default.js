// 数据库配置
exports.databaseConfig = {
  host: "", //数据库地址,上线了之后替换你的服务器IP地址即可
  port: "3306", //端口号
  user: "root", //用户名
  password: "", //填写你的数据库root账户的密码
  database: "", //要访问的数据库名称
  timezone: "08:00", // 数据库时间格式转化
};

// 加密accessToken的盐
exports.jwtSecretKey = "";
// 加密refreshToken的盐;
exports.refreshTokenjwtSecretKey = "";

// 七牛云配置
exports.accessKey = "";
exports.secretKey = "";
exports.baseUrl = ""; // 图片域名
exports.bucket = ""; // 空间名

// 邮箱验证码配置
exports.mailconfig = {
  host: "smtp.qq.com", // 邮箱
  port: 465, // 默认端口
  auth: {
    user: "", // 邮箱账号
    pass: "", // 邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会知道了
  },
};
