//引入mysql
const mysql = require("mysql");
// 导入数据库配置信息
const config = require("../config/default");

// 封装数据库连接方法
const connectionDB = (sql, params) => {
  return new Promise((resolve, reject) => {
    // 创建数据库连接
    const connection = mysql.createConnection(config.databaseConfig);
    // 连接数据库
    connection.connect((err, conn) => {
      // conn： 这是表示数据库连接的对象。
      // 当连接成功时，可以使用这个对象执行数据库查询和其他操作
      if (err) {
        console.log("Failure");
        reject(err);
      } else {
        console.log("Database Connected");
      }
      if (typeof params == "undefined") {
        connection.query(sql, (err, result, fields) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } else {
        // results作为数据操作后的结果，fields作为数据库连接的一些字段
        connection.query(sql, params, (err, result, fields) => {
          if (err) {
            reject(err);
          }
          // 将查询出来的数据返回给回调函数
          // 如果 callback 存在（不为 null 或 undefined），调用这个函数传递了callback这个第三个参数
          // 则调用 callback 函数并传递 results 和 fields 作为参数。
          resolve(result);
          // 停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
        });
      }
      connection.end((err) => {
        if (err) {
          console.log("Disconnected Failure");
          reject(err);
        }
        console.log("Database Disconnected");
      });
    });
  });
};
module.exports = connectionDB;
