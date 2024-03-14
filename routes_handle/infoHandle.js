const db = require("../db/connection");
// 查询友链
exports.getInfo = async (req, res) => {
  const getSql = "select * from information where id = 1";
  db(getSql).then((response) => {
    return res.send({
      code: 200,
      message: "success",
      data: response[0],
    });
  });
};

// 修改
exports.updateInfo = async (req, res) => {
  const updateSql = "UPDATE information SET ?  WHERE id = 1";
  db(updateSql, req.body).then((result) => {
    if (result.affectedRows == 1) {
      res.send({
        code: 200,
        messgae: "修改成功",
      });
    } else {
      res.send({
        code: -200,
        messgae: "修改失败",
      });
    }
  });
};
