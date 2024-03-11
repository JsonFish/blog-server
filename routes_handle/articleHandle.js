const db = require("../db/connection");
// 查询文章
exports.getArticleList = async (req, res) => {
  if (req.query.currentPage && req.query.pageSize) {
    const { currentPage, pageSize, articleTitle, status } = req.query;
    // const PageNum = parseInt(currentPage) || 1;
    // const size = parseInt(pageSize) || 10;
    const inquireArticleTotal = `select * from article where status = ? and articleTitle like "%${articleTitle}%"`;
    let total;
    await db(inquireArticleTotal, status).then((result) => {
      total = result.length;
    });
    const inquireArticleList = `SELECT * FROM article where status = ? and articleTitle like "%${articleTitle}%" ORDER BY create_time DESC LIMIT ${pageSize}  OFFSET ${
      (currentPage - 1) * pageSize
    }`;
    db(inquireArticleList, status).then((results) => {
      res.send({
        code: 200,
        data: {
          articleList: results,
          total: total,
        },
        message: "success",
      });
    });
  } else {
  }
};

// 添加或修改文章
exports.addOrUpdateArticle = async (req, res) => {
  const articleInfo = req.body;
  // 修改
  if (articleInfo.id) {
    return res.send({
      code: 200,
      data: null,
      message: "修改成功",
    });
  }
  delete articleInfo.id;
  articleInfo.tagIds = articleInfo.tagIds.join(",");
  const addArticleSql = "insert into article set ?";
  db(addArticleSql, articleInfo).then((result) => {
    if (result.affectedRows == 1) {
      return res.send({
        code: 200,
        data: null,
        message: "success",
      });
    }
  });
};

// 删除文章
exports.deleteArticle = async (req, res) => {
  if (req.body.id.length < 0) {
    return res.send({
      code: 400,
      data: {},
      message: "删除失败",
    });
  }
  const deleteCategorySql = `UPDATE category SET status = 1 WHERE id IN (${req.body.id.join(
    ","
  )})`;
  const result = await db(deleteCategorySql);
  if ((result.affectedRows = 1)) {
    return res.send({
      code: 200,
      data: {},
      message: "删除成功",
    });
  }
};
