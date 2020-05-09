import qiniu from 'qiniu';
const dotenv = require('dotenv');
dotenv.config();

const qiniuAPI = (configId = null) => {
  // store keys outside
  const accessKey = process.env.QINIU_ACCESSKEY;
  const secretKey = process.env.QINIU_SECRETKEY;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  // bucket based on userId
  const bucket = configId;

  return {
    getToken: () => {
      const options = {
        scope: bucket,
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
          qiniu.rs.deleteOp(bucket, anImage)
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
                console.log(respInfo.deleteusCode);
                console.log(respBody);
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