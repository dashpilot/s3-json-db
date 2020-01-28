const S3DB = require('./index');
const entry = new S3DB(s3_key, s3_secret, s3_bucket, s3_folder);

var data = {
  title: 'This is some example data',
  body: 'Lorem ipsum dolor site amet'
}
console.log(entry.create(data));
