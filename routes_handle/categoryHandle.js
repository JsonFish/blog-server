const db = require("../db/connection");
// 查询分类
exports.getCategoryList = async (req, res) => {
  if (req.query.currentPage && req.query.pageSize) {
    const { currentPage, pageSize, categoryName } = req.query;
    // const PageNum = parseInt(currentPage) || 1;
    // const size = parseInt(pageSize) || 10;
    const inquireCategoryTotal = `select * from category where status = ? and categoryName like "%${categoryName}%"`;
    let total;
    await db(inquireCategoryTotal, 0).then((result) => {
      total = result.length;
    });
    const inquireCategoryList = `SELECT * FROM category where status = 0 and categoryName like "%${categoryName}%" ORDER BY create_time DESC LIMIT ${pageSize}  OFFSET ${
      (currentPage - 1) * pageSize
    }`;
    db(inquireCategoryList).then((results) => {
      res.send({
        code: 200,
        data: {
          categoryList: results,
          total: total,
        },
        message: "success",
      });
    });
  } else {
    const inquireCategoryList = "SELECT * FROM category where status = 0";
    db(inquireCategoryList).then((results) => {
      res.send({
        code: 200,
        data: {
          categoryList: results,
        },
        message: "success",
      });
    });
  }
};

// 添加或修改分类
exports.addOrUpdateCategory = async (req, res) => {
  if (!req.body.categoryName || !req.body.categoryImage) {
    return res.send({
      code: 300,
      data: {},
      message: "参数不能为空",
    });
  }

  if (req.body.id) {
    const inquireCategorySql =
      "select categoryName,categoryImage from category where id=? and status = 0";
    const result = await db(inquireCategorySql, req.body.id);
    if (
      result[0].categoryName == req.body.categoryName &&
      result[0].categoryImage == req.body.categoryImage
    ) {
      return res.send({
        code: 222,
        data: null,
        message: "数据未修改",
      });
    }
    // 更新
    const updateCategoryNameSql =
      "UPDATE category SET categoryName = ?, categoryImage = ?  WHERE id = ?";
    await db(updateCategoryNameSql, [
      req.body.categoryName,
      req.body.categoryImage,
      req.body.id,
    ]).then((result) => {
      if (result.affectedRows == 1) {
        res.send({
          code: 200,
          messgae: "修改成功",
        });
      }
    });
  } else {
    // 新增
    // 查询是否已存在
    const inquireSql = "select * from category where categoryName = ?";
    const result = await db(inquireSql, req.body.categoryName);
    if (result.length != 0) {
      return res.send({ code: 100, message: "该分类已存在", data: null });
    }
    const sql = "insert into category set ?";
    db(sql, {
      categoryName: req.body.categoryName,
      categoryImage: req.body.categoryImage,
    }).then((result) => {
      if (result.affectedRows == 1) {
        res.send({ code: 200, message: "添加成功", data: null });
      }
    });
  }
};

// 删除分类
exports.deleteCategory = async (req, res) => {
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
