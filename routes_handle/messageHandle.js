const db = require("../db/connection");
// 查询留言
exports.getMessageList = async (req, res) => {
  const { currentPage, pageSize, status } = req.query;
  // 后台查询
  if (currentPage && pageSize) {
    const inquireTotal = `select * from messages where status = ?`;
    let total;
    await db(inquireTotal, status).then((result) => {
      total = result.length;
    });
    const inquireList = `SELECT * FROM messages where status = ? ORDER BY create_time DESC LIMIT ${pageSize}  OFFSET ${
      (currentPage - 1) * pageSize
    }`;
    db(inquireList, status).then((results) => {
      res.send({
        code: 200,
        data: {
          messageList: results,
          total: total,
        },
        message: "success",
      });
    });
  } else {
    // 前台查询
    const inquireList = `select * from messages where status = 1`;
    db(inquireList).then((response) => {
      return res.send({
        code: 200,
        message: "success",
        data: response,
      });
    });
  }
};

// 新增留言
exports.addMessage = async (req, res) => {
  const { username, id, avatar } = req.user;
  const { message } = req.body;
  const sql = "insert into messages set ?";
  db(sql, {
    avatar,
    username,
    userId: id,
    message,
  }).then((result) => {
    if (result.affectedRows == 1) {
      return res.send({ code: 200, message: "留言成功", data: null });
    }
  });
};

// 审核留言
exports.auditMessage = (req, res) => {
  const { id } = req.body;
  const auditSql = "UPDATE messages SET status = 1  WHERE id = ?";
  db(auditSql, id).then((response) => {
    if (response.affectedRows == 1) {
      return res.send({
        code: 200,
        message: "success",
      });
    } else {
      return res.send({
        code: 2300,
        message: "操作失败",
      });
    }
  });
};

// 删除留言
exports.deleteMessage = async (req, res) => {
  const { id } = req.body;
  if (id.length < 0) {
    return res.send({
      code: 400,
      data: {},
      message: "删除失败",
    });
  }
  const deleteSql = `UPDATE messages SET status = 2 WHERE id IN (${id.join(
    ","
  )})`;
  const result = await db(deleteSql);
  if ((result.serverStatus = 2)) {
    return res.send({
      code: 200,
      data: {},
      message: "删除成功",
    });
  } else {
    return res.send({
      code: 200,
      message: "删除失败",
    });
  }
};
