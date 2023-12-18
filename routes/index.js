var express = require('express');
var router = express.Router();
router.use(require("./test.js"));
router.use(require('./users.js'))
module.exports = router;
