const db = require("../db/connection");

exports.getInfo = async (req, res) => {
  const getSql = "select * from information";
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
  const updateSql = "UPDATE information SET ? ";
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
