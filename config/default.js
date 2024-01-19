// 数据库配置
exports.databaseConfig = {
  host: "127.0.0.1", //数据库地址,上线了之后替换你的服务器IP地址即可
  port: "3306", //端口号
  user: "root", //用户名
  password: "admin123", //填写你的数据库root账户的密码
  database: "blog", //要访问的数据库名称
};
// 加密token的盐
exports.jwtSecretKey = "XiaoYuNumberOne^_^";
