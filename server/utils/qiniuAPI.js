import qiniu from 'qiniu';

const qiniuAPI = () => {
  var accessKey = '1onu7yWhC-cnKDKXpXb9qFTYLDXIIBtVGNOY_4i3';
  var secretKey = '5fx73jAMgIi3CVSryCNL4YxuRxuRne4bHy_vWQHO';
  var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  var options = {
    scope: 'pwg-saas-images',
    //expires: 7200
    //returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
    //callbackBodyType: 'application/json'
  };
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken = putPolicy.uploadToken(mac);

  var config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z0;

  var localFile = "/Users/jemy/Documents/qiniu.mp4";
  var formUploader = new qiniu.form_up.FormUploader(config);
  var putExtra = new qiniu.form_up.PutExtra();
  var key='test.png';

  return {
    upload: () => {
      formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
        respBody, respInfo) {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          console.log(respBody);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
        }
      });
    },
    get: () => {
  
    },
    remove: () => {
  
    }
  }
}

export default qiniuAPI;