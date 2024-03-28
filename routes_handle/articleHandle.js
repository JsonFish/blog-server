const db = require("../db/connection");
// 后台获取文章列表
exports.getArticleList = async (req, res) => {
  // 后台分页查询
  if (req.query.currentPage && req.query.pageSize) {
    const { currentPage, pageSize, articleTitle, status } = req.query;
    const inquireArticleTotal = `select * from article where status = ? and articleTitle like "%${articleTitle}%"`;
    let total;
    await db(inquireArticleTotal, status).then((result) => {
      total = result.length;
    });
    const inquireArticleList = `SELECT * FROM article where status = ? and articleTitle like "%${articleTitle}%" ORDER BY update_time DESC LIMIT ${pageSize}  OFFSET ${
      (currentPage - 1) * pageSize
    }`;
    db(inquireArticleList, status).then((results) => {
      results.forEach((item) => {
        item.tags = JSON.parse(item.tags);
        item.tagIds = item.tagIds.split(",").map(Number);
      });
      return res.send({
        code: 200,
        data: {
          articleList: results,
          total: total,
        },
        message: "success",
      });
    });
  }else{
    return res.send({
      code:20,
      message:"参数错误"
    })
  }
};

// id查询文章
exports.getArticleById = (req,res)=>{
  if (req.query.id) {
    const id = req.query.id;
    const sql = "select * from article where id = ?";
    db(sql, id).then(async (result) => {
      result.forEach((item) => {
        item.tags = JSON.parse(item.tags);
        item.tagIds = item.tagIds.split(",").map(Number);
      });
      const browseSql = "update article set browse = browse + 1 where id = ?";
      await db(browseSql, id);
      return res.send({
        code: 200,
        data: result[0],
        message: "success",
      });
    });
  }else{
    return res.send({
      code:-200,
      message:"参数错误"
    })
  }
}

// 前台获取文章列表
exports.reqGetArticleList = async (req, res) => {
  const { currentPage, pageSize } = req.query;
  const inquireArticleTotal = `select * from article where status = 0`;
  let total;
  await db(inquireArticleTotal).then((result) => {
    total = result.length;
  });
  const inquireArticleList = `SELECT * FROM article where status = 0 ORDER BY "order" ASC, isTop DESC LIMIT ${pageSize} OFFSET ${
    (currentPage - 1) * pageSize
  }`;
  db(inquireArticleList).then((results) => {
    results.forEach((item) => {
      item.tags = JSON.parse(item.tags);
      item.tagIds = item.tagIds.split(",").map(Number);
    });
    return res.send({
      code: 200,
      data: {
        articleList: results,
        total: total,
      },
      message: "success",
    });
  });
};

// 添加或修改文章
exports.addOrUpdateArticle = async (req, res) => {
  const articleInfo = req.body;
  //  先查询分类和标签
  const selectCategory =
    "select categoryName from category where status = 0 and id = ?";
  const result = await db(selectCategory, articleInfo.categoryId);
  articleInfo.categoryName = result[0].categoryName;
  const selectTag = `select tagName from tags where status = 0 and id in (${articleInfo.tagIds.join(
    ","
  )})`;
  const results = await db(selectTag);
  articleInfo.tags = JSON.stringify(results);
  articleInfo.tagIds = articleInfo.tagIds.join(",");
  // 修改文章
  if (articleInfo.id) {
    const { id } = articleInfo;
    delete articleInfo.id;
    const updateSql = " update article set  ? where id = ?";
    db(updateSql, [articleInfo, id]).then((result) => {
      if (result.affectedRows == 1) {
        return res.send({
          code: 200,
          message: "修改成功",
        });
      }
      return res.send({
        code: 1001,
        message: "修改失败",
      });
    });
  } else {
    // 新增文章
    const addArticleSql = "insert into article set ?";
    db(addArticleSql, articleInfo).then((result) => {
      if (result.affectedRows == 1) {
        return res.send({
          code: 200,
          data: null,
          message: "success",
        });
      } else {
        return res.send({
          code: 2000,
          data: null,
          message: "新增失败",
        });
      }
    });
  }
};

// 修改文章状态
exports.updateArticleStatus = (req, res) => {
  const { id } = req.body;
  const sql = "select status from article where id = ?";
  db(sql, id).then((response) => {
    const status = response[0].status == 1 ? 0 : 1;
    const updateSql = "update article set status = ? where id = ?";
    db(updateSql, [status, id]).then((result) => {
      if (result.affectedRows == 1) {
        return res.send({
          code: 200,
          message: "success",
        });
      }
    });
  });
};

// 删除文章
exports.deleteArticle = async (req, res) => {
  if (!req.body.id) {
    return res.send({
      code: 400,
      message: "删除失败",
    });
  }
  const deleteSql = `UPDATE article SET status = 3 WHERE id = ? `;
  const result = await db(deleteSql, req.body.id);
  if (result.affectedRows == 1) {
    return res.send({
      code: 200,
      message: "success",
    });
  }
  return res.send({
    code: 400,
    message: "删除失败",
  });
};

// 获取草稿列表
exports.getDraft = async (req, res) => {
  // 查询草稿详情
  if (req.query.id) {
    const sql = "select * from article where status = 2 and id = ?";
    db(sql, req.query.id).then((response) => {
      if (response) {
        res.send({
          code: 200,
          data: {
            articleList: response,
          },
          message: "success",
        });
      }
      return;
    });
    return;
  }
  const { currentPage, pageSize, articleTitle } = req.query;
  const inquireArticleTotal = `select * from article where status = 2 and articleTitle like "%${articleTitle}%"`;
  let total;
  await db(inquireArticleTotal).then((result) => {
    total = result.length;
  });
  const inquireArticleList = `SELECT * FROM article where status = 2 and articleTitle like "%${articleTitle}%" ORDER BY create_time DESC LIMIT ${pageSize}  OFFSET ${
    (currentPage - 1) * pageSize
  }`;
  db(inquireArticleList).then((results) => {
    if (results) {
      return res.send({
        code: 200,
        data: {
          articleList: results,
          total: total,
        },
        message: "success",
      });
    }
  });
};
// 保存草稿 | 更新
exports.saveDraft = (req, res) => {
  const { articleContent, articleTitle, id } = req.body;
  if (!articleContent || !articleTitle) {
    return res.send({
      code: 2000,
      message: "参数错误",
    });
  }
  if (id) {
    const updateSql = "update article set ? where id = ?";
    db(updateSql, [
      {
        articleContent,
        articleTitle,
      },
      id,
    ]).then((response) => {
      if (response.affectedRows == 1) {
        res.send({
          code: 200,
          message: "success",
        });
      }
    });
  } else {
    const saveDraftSql = "insert into article set ?";
    db(saveDraftSql, {
      articleContent,
      articleTitle,
      status: 2,
    }).then((result) => {
      if (result.affectedRows == 1) {
        res.send({
          code: 200,
          message: "success",
        });
      }
    });
  }
};
