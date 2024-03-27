const db = require("../db/connection");
// 密码加盐
const bcrypt = require("bcryptjs");
// 用户更新个人信息
exports.updateUserInfo = async (req, res) => {
  let salt = bcrypt.genSaltSync(10); //其中 10 是工作因子，表示计算哈希所需的成本。工作因子越高，计算哈希的成本越高，生成哈希密码时间越长 密码越安全
  // 密码加密
  const bcryptPassword = bcrypt.hashSync("123", salt); // 将密码与盐进行哈希加密
  console.log(bcryptPassword);
};
