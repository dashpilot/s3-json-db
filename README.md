# s3-json-db

Use Amazon S3 as a simple JSON database and serverless API

# About

S3 JSON DB is a simple file-based JSON database for Amazon S3. It allows you to insert, update, retrieve and delete entries. All entries are stored on S3 as objects in a single json file, so you can also easily retrieve them from a Single Page Application or any server-side rendered app (without needing this module). You can use it to quickly prototype a serverless app or backend for your SPA.

# Usage

```javascript
const S3DB = require('s3-json-db');
const db = new S3DB(s3_key, s3_secret, s3_bucket, s3_prefix, s3_acl);
const table = 'entries';

let data = {
  title: 'This is the first entry',
  body: 'Lorem ipsum dolor site amet'
}

// insert
db.insert(table, data).then(id => {
  console.log("created " + id);
});

// update
db.update(table, data, id).then(id => {
  console.log("updated " + id);
});

// delete
db.delete(table, id).then(id => {
  console.log("deleted " + id);
});

// get one entry by id
db.get(table, id).then(data => {
  console.log(data);
});

// get all entries
db.get_all(table).then(data => {
  console.log(data);
});
```

# Configuration

    s3_key (required): your S3 API key
    s3_secret (required): your S3 API secret
    s3_bucket (required): your S3 bucket
    s3_prefix (optional): optional file prefix or subfolder (for the latter end with a slash). default "";
    s3_acl (optional): ACL (https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl). Default: "private", set to "public-read" if you want your data to be public (to use with a client-side app).

To retrieve all entries client-side (set s3_acl to "public-read"):

```javascript
{your_s3_url}/{bucket}/{s3_prefix}/{table}.json
```

# Press the :star: button
Don't forget to press the :star: button to let me know I should continue improving this project.
