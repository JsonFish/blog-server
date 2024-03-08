const db = require("../db/connection");
// 查询用户列表
exports.getUserList = async (req, res) => {
  const { currentPage, pageSize, username } = req.query;
  //   const currentPage = parseInt(req.query.currentPage) || 1;
  //   const pageSize = parseInt(req.query.pageSize) || 10;
  const inquireUserTotal = `select * from users where status = ? and username like "%${username}%"`;
  let total;
  await db(inquireUserTotal, 0).then((response) => {
    total = response.length;
  });
  const inquireUserListSql = `SELECT * FROM users WHERE status = 0 and username like "%${username}%" ORDER BY create_time ASC LIMIT ${pageSize}  OFFSET ${
    (currentPage - 1) * pageSize
  }`;
  const results = await db(inquireUserListSql);
  const userList = results.map((item) => {
    const { password, ...rest } = item;
    return rest;
  });
  res.send({
    code: 200,
    data: {
      userList: userList,
      total: total,
    },
    message: "success",
  });
};
exports.updateUserInfo = (req, res) => {};
// 删除用户
exports.deleteUser = async (req, res) => {
  console.log(req.body.id);
  if (req.body.id.length < 0) {
    return res.send({
      code: 400,
      data: null,
      message: "删除失败",
    });
  }
  const deleteSql = `UPDATE users SET status = 1 WHERE id IN (${req.body.id.join(
    ","
  )})`;
  const result = await db(deleteSql);
  if (result.serverStatus == 2) {
    return res.send({
      code: 200,
      data: null,
      message: "删除成功",
    });
  }
  res.send({
    code: 400,
    data: null,
    message: "删除失败",
  });
};
