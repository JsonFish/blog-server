const db = require("../db/connection");

exports.getHomeBackImg = async (req, res) => {
  const getSql = "select webSiteBg from information";
  db(getSql).then((response) => {
    console.log(response);
    return res.send({
      code: 200,
      message: "success",
      data: response[0].webSiteBg,
    });
  });
};

exports.getLoginImg = async (req, res) => {
  const getSql = "select loginBg from information";
  db(getSql).then((response) => {
    console.log(response);
    return res.send({
      code: 200,
      message: "success",
      data: response[0].loginBg,
    });
  });
};
