// 用户权限验证
const authentication = (req, res, next) => {
  if (req.user && req.user.role != 2) {
    return res.send({
      code: 403,
      data: null,
      message: "无权限!",
    });
  }
  next();
};
module.exports = authentication;
