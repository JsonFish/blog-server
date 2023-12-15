var express = require('express');
var router = express.Router();
router.use(require("./users.js"));
router.use(require('./registration.js'))
module.exports = router;
