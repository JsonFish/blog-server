const db = require("../db/connection");
exports.getDialyList = async (req, res) => {
  const { currentPage, pageSize } = req.query;
  const totalSql = `select * from daily where status = 0`;
  let total;
  await db(totalSql).then((results) => {
    total = results.length;
  });
  const sql = `SELECT * FROM daily where status = 0 ORDER BY create_time DESC LIMIT ${pageSize}  OFFSET ${
    (currentPage - 1) * pageSize
  }`;
  db(sql).then(async (resposne) => {
    resposne.forEach((item) => {
      item.images = JSON.parse(item.images);
    });
    const selectSql = "select username,avatar from users where role = 2";
    const result = await db(selectSql);
    res.send({
      code: 200,
      message: "success",
      data: { ...result[0], dynamicList: resposne, total },
    });
  });
};
exports.addDialy = (req, res) => {
  const info = req.body;
  info.images = JSON.stringify(info.images);
  console.log(info.images);
  const sql = "insert into daily set ?";
  db(sql, info).then((resposne) => {
    if (resposne.affectedRows == 1) {
      return res.send({
        code: 200,
        message: "success",
      });
    }
  });
};
exports.deleteDialy = (req, res) => {
  const id = req.body.id;
  const deleteSql = "update daily set status = 1 where id =?";
  db(deleteSql, id).then((resposne) => {
    if (resposne.affectedRows == 1) {
      return res.send({
        code: 200,
        message: "success",
      });
    } else {
      res.send({
        code: 210,
        message: "删除失败",
      });
    }
  });
};
