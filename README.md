# s3-json-db

Use Amazon S3 as a simple JSON database and serverless API

# About

S3 JSON DB is a simple file-based JSON database for Amazon S3. It allows you to insert, update, retrieve and delete entries. All entries are stored on S3 as objects in a single json file, so you can also easily retrieve them from a Single Page Application or any server-side rendered app (without needing this module). You can use it to quickly prototype a serverless app or backend for your SPA.

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

To retrieve all entries client-side:

```javascript
{your_s3_url}/{bucket}/{s3_folder}/{table}.json
```
