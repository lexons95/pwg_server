import qiniu from 'qiniu';
const dotenv = require('dotenv');
dotenv.config();

const qiniuAPI = (bucketName = null) => {
  // store keys outside
  const accessKey = process.env.QINIU_ACCESSKEY;
  const secretKey = process.env.QINIU_SECRETKEY;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  // bucket based on userId
  const srcBucket = bucketName;

  return {
    getToken: () => {
      const options = {
        scope: srcBucket,
        expires: 3600 * 24
        //returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
        //callbackBodyType: 'application/json'
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      let response = {
        success: false,
        message: "Failed to get token",
        data: {}
      };
    
      if (uploadToken) {
        response = {
          success: true,
          message: "Get token success",
          data: uploadToken
        }
      }
      return response;
    },
    batchDelete: async (images) => {
      var config = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z0;
      var bucketManager = new qiniu.rs.BucketManager(mac, config);

      let deleteOperations = [];
      images.map((anImage)=>{
        deleteOperations.push(
          qiniu.rs.deleteOp(srcBucket, anImage)
        )
      })

      return new Promise((resolve, reject) => {
        if (deleteOperations.length > 0) {
          bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
            if (err) {
              reject({
                success: false,
                message: "Failed to delete",
                data: {}
              })
            } else {
              // 200 is success, 298 is part success
              if (parseInt(respInfo.statusCode / 100) == 2) {
                respBody.forEach(function(item) {
                  if (item.code == 200) {
                    console.log(item.code + "\tsuccess");
                  } else {
                    console.log(item.code + "\t" + item.data.error);
                  }
                });
                resolve({
                  success: true,
                  message: "All deleted",
                  data: {}
                })
              } else {
                reject({
                  success: false,
                  message: "Something wrong during delete but jobs completed",
                  data: {}
                })
              }
            }
          });
        }
        else {
          reject({
            success: false,
            message: "No images found",
            data: {}
          })
        }
      })

    },
    batchCopy: async (images, targetBucket) => {
      var config = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z0;
      var bucketManager = new qiniu.rs.BucketManager(mac, config);

      let copyOperations = [];
      // images.map((anImage)=>{
      //   copyOperations.push(
      //     qiniu.rs.copyOp(srcBucket, anImage, targetBucket, anImage)
      //   )
      // })

      copyOperations = [
        qiniu.rs.copyOp(srcBucket, 'logo.png', targetBucket, 'logo.png'),
        //qiniu.rs.copyOp(srcBucket, 'saas_payment_1590629388851_wechatPayQR copy.jpg', targetBucket, 'saas_payment_1590629388851_wechatPayQR copy.jpg')
      ]
      return new Promise((resolve, reject) => {
        if (copyOperations.length > 0) {
          bucketManager.batch(copyOperations, function(err, respBody, respInfo) {
            if (err) {
              reject({
                success: false,
                message: "Failed to copy",
                data: {}
              })
            } else {
              // 200 is success, 298 is part success
              if (parseInt(respInfo.statusCode / 100) == 2) {
                respBody.forEach(function(item) {
                  if (item.code == 200) {
                    console.log(item.code + "\tsuccess");
                  } else {
                    console.log(item.code + "\t" + item.data.error);
                  }
                });
                resolve({
                  success: true,
                  message: "All copied",
                  data: {}
                })
              } else {
                reject({
                  success: false,
                  message: "Something wrong during delete but jobs completed",
                  data: {}
                })
              }
            }
          });
        }
        else {
          reject({
            success: false,
            message: "No images found",
            data: {}
          })
        }
      })

    }
  }
}

export default qiniuAPI;