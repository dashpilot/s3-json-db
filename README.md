# s3-json-db

Use Amazon S3 as a simple JSON database and serverless API

# About

S3 JSON DB is a simple file-based JSON database for Amazon S3, which also automatically generates a JSON API. It allows you to insert, update, retrieve and delete entries. All entries are stored on S3 as objects in a single json file, so you can easily retrieve them from a Single Page Application or any server-side rendered app (without needing this module). You can use it to quickly prototype a serverless app or backend for your SPA.

# Usage

```javascript
const S3DB = require('s3-json-db');
const db = new S3DB(s3_key, s3_secret, s3_bucket, s3_folder);
const table = 'entries';

let data = {
  title: 'This is the first entry',
  body: 'Lorem ipsum dolor site amet'
}

// insert
db.insert(table, data).then(function(id) {
  console.log("created " + id);
});

// update
db.update(table, data, id).then(function(id) {
  console.log("updated " + id);
});

// delete
db.delete(table, id).then(function(id) {
  console.log("deleted " + id);
});

// list all entries
db.list(table).then(function(data) {
  console.log(data);
});
```

To retrieve all entries client-side:
    {your_s3_url}/{bucket}/{s3_folder}/{table}.json
