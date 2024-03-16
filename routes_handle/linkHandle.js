const db = require("../db/connection");
// 查询友链
exports.getLinkList = async (req, res) => {
  if (req.query.currentPage && req.query.pageSize) {
    const { currentPage, pageSize, siteName, status } = req.query;
    const inquireLinkTotal = `select * from links where status = ? and siteName like "%${siteName}%"`;
    let total;
    await db(inquireLinkTotal, status).then((result) => {
      total = result.length;
    });
    const inquireLinkList = `SELECT * FROM links where status = ? and siteName like "%${siteName}%" ORDER BY create_time DESC LIMIT ${pageSize}  OFFSET ${
      (currentPage - 1) * pageSize
    }`;
    db(inquireLinkList, status).then((results) => {
      res.send({
        code: 200,
        data: {
          linkList: results,
          total: total,
        },
        message: "success",
      });
    });
  } else {
    const inquireLinkList = "SELECT * FROM links where status = 1";
    db(inquireLinkList).then((results) => {
      res.send({
        code: 200,
        data: {
          linkList: results,
        },
        message: "success",
      });
    });
  }
};

// 添加(申请)或修改友链
exports.addOrUpdateLink = async (req, res) => {
  const applicant = req.user.username;
  const linkInfo = req.body;
  linkInfo.applicant = applicant;
  const { id, siteName, description, siteAvatar, siteUrl } = linkInfo;
  if (siteName && description && siteAvatar && siteUrl) {
    return res.send({
      code: 1010,
      message: "参数错误",
    });
  }
  // 修改
  if (id) {
    // 更新
    delete linkInfo.id;
    const updateLinkSql = "UPDATE links SET ?  WHERE id = ?";
    db(updateLinkSql, [linkInfo, id]).then((result) => {
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
  } else {
    // 新增
    const sql = "insert into links set ?";
    db(sql, linkInfo).then((result) => {
      if (result.affectedRows == 1) {
        res.send({ code: 200, message: "添加成功", data: null });
      } else {
        res.send({
          code: -200,
          messgae: "添加失败",
        });
      }
    });
  }
};
// 同意友链申请
exports.agreeAccept = async (req, res) => {
  const id = req.body.id;
  const sql = "UPDATE links SET status = 1  WHERE id = ?";
  db(sql, id).then((response) => {
    if (response.affectedRows == 1) {
      res.send({
        code: 200,
        message: "success",
      });
    }
  });
};
// 删除友链
exports.deleteLink = async (req, res) => {
  if (req.body.id.length < 0) {
    return res.send({
      code: 400,
      data: {},
      message: "删除失败",
    });
  }
  const deleteLinkSql = `UPDATE links SET status = 2 WHERE id IN (${req.body.id.join(
    ","
  )})`;
  const result = await db(deleteLinkSql);
  if (result.affectedRows != 0) {
    return res.send({
      code: 200,
      message: "删除成功",
    });
  }
};
