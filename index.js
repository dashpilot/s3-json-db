const AWS = require('aws-sdk')

class S3DB {

  constructor(s3_key, s3_secret, s3_bucket, s3_folder) {
    this.s3_key = s3_key;
    this.s3_secret = s3_secret;
    this.s3_bucket = s3_bucket;
    this.s3_folder = s3_folder;

    // Amazon S3
    AWS.config.update({
      accessKeyId: s3_key,
      secretAccessKey: s3_secret
    });

    this.s3Bucket = new AWS.S3({
      params: {
        Bucket: s3_bucket,
        timeout: 6000000
      }
    });
  }

  create(data) {

    // generate a new id
    var dt = new Date();
    var now = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2) + ("0" + dt.getDate()).slice(-2);
    var id = now + '-' + Math.floor(Math.random() * Math.floor(99999));
    // data.data.id = id;

    var params = {
      ACL: 'public-read',
      Key: this.s3_folder + '/entries/' + id + '.json',
      Body: JSON.stringify(data), // save as array, needed for file_concat
      ContentType: 'application/json'
    };

    this.s3Bucket.putObject(params, (error, data) => {
      if (error) console.log(error);

      this.combineFiles();

    });

  }

  /* list the entries in the bucket */
  async listFiles() {

    var params = {
      Bucket: this.s3_bucket,
      Delimiter: '/',
      Prefix: this.s3_folder + '/entries/'
    }



    return await this.s3Bucket.listObjects(params).promise();

  }


  async combineFiles() {

    var files = await this.listFiles();
    var array = [];

    for (var file of files.Contents) {

      var params = {
        Bucket: this.s3_bucket, // your bucket name,
        Key: file.Key // path to the object you're looking for
      }

      var item = await this.s3Bucket.getObject(params).promise();
      array.push(JSON.parse(item.Body.toString('utf-8')));

    }

    var params = {
      ACL: 'public-read',
      Key: this.s3_folder + '/entries.json',
      Body: JSON.stringify(array), // save as array, needed for file_concat
      ContentType: 'application/json'
    };

    return await this.s3Bucket.putObject(params).promise();

  }

}
module.exports = S3DB;
