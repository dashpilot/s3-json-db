const AWS = require('aws-sdk')

class S3DB {

  constructor(s3_key, s3_secret, s3_bucket, s3_prefix = '', s3_acl = 'private', s3_endpoint = false) {
    this.s3_key = s3_key
    this.s3_secret = s3_secret
    this.s3_bucket = s3_bucket
    this.s3_prefix = s3_prefix
    this.s3_acl = s3_acl

    var s3_config = {
      accessKeyId: s3_key,
      secretAccessKey: s3_secret
    }
    if (s3_endpoint) {
      const endpoint = new AWS.Endpoint(s3_endpoint);
      s3_config.endpoint = endpoint
    }
    AWS.config.update(s3_config);

    this.s3Bucket = new AWS.S3({
      params: {
        Bucket: s3_bucket,
        timeout: 6000000
      }
    });
  }


  async insert(table, data) {

    // get the current data
    const curdata = await this.get_all(table)

    // generate a new id
    const id = this.generate_id()
    data._id = id

    // add the new data
    curdata.push(data)

    // save
    await this.save(table, curdata)

    return id

  }

  async update(table, data, id) {

    // get the current data
    const curdata = await this.get_all(table)

    // get array key based on _id
    const index = curdata.findIndex(x => x._id === id)
    curdata[index] = data

    // save
    await this.save(table, curdata)

    return id

  }

  async delete(table, id) {

    // get the current data
    const curdata = await this.get_all(table)

    // get array key based on _id
    const index = curdata.findIndex(x => x._id === id);
    const newdata = curdata.slice(0, index).concat(curdata.slice(index + 1, curdata.length))

    // save
    await this.save(table, newdata)

    return id

  }


  async get_all(table) {

    var params = {
      Bucket: this.s3_bucket,
      Key: this.s3_prefix + table + '.json'
    };

    return await this.s3Bucket.getObject(params).promise()
      .then(function(data) {
        return JSON.parse(data.Body.toString('utf-8'))
      })
      .catch(function(error) {
        return []
      })

  }

  async get(table, id) {

    // get the current data
    const curdata = await this.get_all(table)

    // get array key based on _id
    const data = curdata.find(x => x._id === id)

    return data

  }

  async save(table, data) {

    // save
    var params = {
      ACL: this.s3_acl,
      Key: this.s3_prefix + table + '.json',
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    };

    return await this.s3Bucket.putObject(params).promise()

  }

  generate_id() {
    var dt = new Date()
    var now = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2) + ("0" + dt.getDate()).slice(-2)
    var id = now + '-' + Math.floor(Math.random() * Math.floor(99999))
    return id
  }

}
module.exports = S3DB;