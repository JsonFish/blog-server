const fs = require("fs");
const qiniu = require("qiniu");
const config = require("../config/default");
// 密钥
const accessKey = config.accessKey;
const secretKey = config.secretKey;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// 域名名称
const baseUrl = config.baseUrl;
// 空间名称
const bucket = config.bucket;
const options = {
  scope: bucket,
};
// putPolicy 上传凭据
const putPolicy = new qiniu.rs.PutPolicy(options);

// 构建配置
const qiniuConfig = new qiniu.conf.Config();
qiniuConfig.zone = qiniu.zone.Zone_z0; // 华东
// 是否使用https域名
//qiniuConfig.useHttpsDomain = true;
// 上传是否使用cdn加速
//qiniuConfig.useCdnDomain = true;

exports.upload = (req, res) => {
  if (!req.file) {
    return res.send({
      code: -4,
      message: "上传失败",
    });
  }
  const file = req.file;
  console.log(file);
  let key = Date.now().toString() + ".png";
  let path = "./public/images/" + key;
  // 获取上传token
  const uploadToken = putPolicy.uploadToken(mac);
  try {
    fs.renameSync("./public/images/" + file.filename, path);
  } catch (err) {
    throw err;
  }
  let formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
  let putExtra = new qiniu.form_up.PutExtra();
  formUploader.putFile(
    uploadToken,
    key,
    path,
    putExtra,
    (respErr, respBody, respInfo) => {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        res.send({
          code: "200",
          data: {
            url: baseUrl + "/" + respBody.key,
          },
          message: "上传成功",
        });
      } else {
        res.send({
          code: "-1",
          data: {},
          message: respBody.error,
        });
      }
      // 删除照片
      fs.unlinkSync(path);
    }
  );
};

exports.delete = (req, res) => {
  const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);
  const key = req.body.fileName;
  bucketManager.delete(bucket, key, (err, respBody, respInfo) => {
    if (err) {
      throw err;
    }
    if (respInfo.statusCode == 200) {
      res.send({
        code: 200,
        data: null,
        message: "删除成功",
      });
    } else {
      res.send({
        code: -1,
        data: {},
        message: "删除失败",
      });
    }
  });
};
