const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const categoryHandle = require("../routes_handle/categoryHandle");
router.get("/category", categoryHandle.getCategoryList);
router.post("/category", authentication, categoryHandle.addOrUpdateCategory);
router.put("/category", authentication, categoryHandle.addOrUpdateCategory);
router.delete("/category", authentication, categoryHandle.deleteCategory);
module.exports = router;
