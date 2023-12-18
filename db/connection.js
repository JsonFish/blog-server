//引入mysql
const mysql = require("mysql");

// 连接数据库的信息
const db = {
  host: "127.0.0.1", //数据库地址,上线了之后替换你的服务器IP地址即可
  port: "3306", //端口号
  user: "root", //用户名
  password: "admin123", //填写你的数据库root账户的密码
  database: "blog", //要访问的数据库名称
};

// 封装数据库连接方法
const connectionDB = (sql, params, cb) => {
  // 创建数据库连接
  const connection = mysql.createConnection(db);
  // 连接数据库
  connection.connect((err, conn) => {
    if (err) {
      console.log("数据库连接失败");
      return;
    }
    connection.query(sql, params, cb);
  });
};

module.exports = connectionDB;
