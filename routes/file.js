const express = require("express");
const router = express.Router();
// 权限验证中间件
const authentication = require("../middleware/authentication");
const multer = require("multer");
const upload = multer({ dest: "public/images/" }); // 指定文件存储的目录
// 处理函数
const fileHandle = require("../routes_handle/fileHandle")

router.post("/file/upload", authentication, upload.single("file"), fileHandle.upload);
router.post("/file/delete", authentication, fileHandle.delete);
module.exports = router;
