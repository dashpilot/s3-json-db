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


  async create(table, data) {

    // get the current data
    const curdata = await this.curData(table);

    // generate a new id
    const id = this.generateId();
    data._id = id;

    // add the new data
    curdata.push(data);

    // save
    await this.save(table, curdata);

    return id;

  }

  async update(table, data) {

    // get the current data
    const curdata = await this.curData(table);
    const id = data._id;

    // get array key based on _id
    const index = curdata.findIndex(x => x._id === id);

    curdata[index] = data;

    // save
    return await this.save(table, curdata);

  }

  async delete(table, id) {

    // get the current data
    const curdata = await this.curData(table);

    // get array key based on _id
    const index = curdata.findIndex(x => x._id === id);

    curdata.splice(index, 1);

    // save
    return await this.save(table, curdata);

  }


  async curData(table) {

    var params = {
      Bucket: this.s3_bucket,
      Key: this.s3_folder + '/' + table + '.json'
    };

    return await this.s3Bucket.getObject(params).promise()
      .then(function(data) {
        return JSON.parse(data.Body.toString('utf-8'))
      })
      .catch(function(error) {
        return []
      })

  }

  async save(table, data) {

    // save
    var params = {
      ACL: 'public-read',
      Key: this.s3_folder + '/' + table + '.json',
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    };

    return await this.s3Bucket.putObject(params).promise();

  }

  generateId() {
    var dt = new Date();
    var now = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2) + ("0" + dt.getDate()).slice(-2);
    var id = now + '-' + Math.floor(Math.random() * Math.floor(99999));
    return id;
  }

}
module.exports = S3DB;