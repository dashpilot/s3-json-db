const S3DB = require('./index');
const db = new S3DB(s3_key, s3_secret, s3_bucket, s3_folder);

var data = {
  title: 'Lorem Ipsum',
  body: 'Hello there!'
}

db.create('entries', data).then(x => console.log(x));