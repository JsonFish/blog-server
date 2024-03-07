const db = require("../db/connection");
// 查询标签
exports.getTagList = async (req, res) => {
  if (req.query.currentPage && req.query.pageSize) {
    const { currentPage, pageSize, tagName } = req.query;
    // const pageNumber = parseInt(currentPage) || 1;
    // const size = parseInt(pageSize) || 10;
    const inquireTagTotal = `select * from tags where status = ? and tagName like "%${tagName}%"`;
    let total;
    await db(inquireTagTotal, 0).then((result) => {
      total = result.length;
    });
    const inquireTagListSql = `SELECT * FROM tags WHERE status = 0 and tagName like "%${tagName}%" ORDER BY create_time DESC LIMIT ${pageSize}  OFFSET ${
      (currentPage - 1) * pageSize
    }`;
    const results = await db(inquireTagListSql);
    res.send({
      code: 200,
      data: {
        tagList: results,
        total: total,
      },
      message: "success",
    });
  }else{
    const inquireTagList = "SELECT * FROM tags where status = 0";
    db(inquireTagList).then((results) => {
      res.send({
        code: 200,
        data: {
          tagList: results,
        },
        message: "success",
      });
    });
  }
};

// 添加或修改标签
exports.addOrUpdateTag = async (req, res) => {
  if (!req.body.tagName) {
    return res.send({
      code: 300,
      data: {},
      message: "参数不能为空",
    });
  }
  const inquireTagNameSql = "select * from tags where tagName=? and status = 0";
  const results = await db(inquireTagNameSql, req.body.tagName);
  if (results.length != 0) {
    return res.send({
      code: 222,
      data: {},
      message: "该标签已存在",
    });
  }
  if (req.body.id) {
    const updateTagNameSql = "UPDATE tags SET tagName = ? WHERE id = ?";
    await db(updateTagNameSql, [req.body.tagName, req.body.id]).then(
      (result) => {
        if (result.affectedRows == 1) {
          return res.send({
            code: 200,
            data: {},
            messgae: "修改成功",
          });
        } else {
          return res.send({
            code: -1,
            data: null,
            messgae: "修改失败",
          });
        }
      }
    );
  } else {
    const sql = "insert into tags set ?";
    db(sql, { tagName: req.body.tagName }).then((result) => {
      // 影响的行数为1
      if (result.affectedRows !== 1) {
        res.send({ code: 1001, message: err.message });
      } else {
        res.send({ code: 200, message: "添加成功", data: null });
      }
    });
  }
};

// 删除标签
exports.deleteTag = async (req, res) => {
  if (req.body.id.length < 0) {
    return res.send({
      code: 400,
      data: null,
      message: "删除失败",
    });
  }
  const deleteTagSql = `UPDATE tags SET status = 1 WHERE id IN (${req.body.id.join(
    ","
  )})`;
  const result = await db(deleteTagSql);
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
