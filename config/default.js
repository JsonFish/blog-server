// 数据库配置
exports.databaseConfig = {
  host: "120.55.93.186", //数据库地址,上线了之后替换你的服务器IP地址即可
  port: "3306", //端口号
  user: "root", //用户名
  password: "whyswzan1314", //填写你的数据库root账户的密码
  database: "blog", //要访问的数据库名称
  timezone: "08:00", // 数据库时间格式转化
};

// 加密accessToken的盐
exports.jwtSecretKey = "XiaoYuNumberOne^_^";
// 加密refreshToken的盐;
exports.refreshTokenjwtSecretKey = "JsonYuNB666";

// 七牛云配置
exports.accessKey = "ZTTPel3aJqA8o3tStE7pgCuDk9pYOcCFLYroHA1R";
exports.secretKey = "zZABCaQLBswNcBd-amSmiCpEQPwF4Y4v3Id7KFHf";
exports.baseUrl = "http://sa6qp7vwh.hb-bkt.clouddn.com";
exports.bucket = "testblog-admin";
