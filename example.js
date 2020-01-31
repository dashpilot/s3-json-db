const S3DB = require('./index');
const db = new S3DB(s3_key, s3_secret, s3_bucket, s3_folder);
const table = 'posts';

let data = {
  title: 'This is the first entry',
  body: 'Lorem ipsum dolor site amet'
}

// insert
db.insert(table, data).then(function(id) {
  console.log("created " + id);

  let data = {
    title: 'Update of the first entry',
    body: 'Lorem ipsum dolor site amet',
    _id: id
  }

  // update
  db.update(table, data, id).then(function(id) {
    console.log("updated " + id);

    // delete
    db.delete(table, id).then(function(id) {
      console.log("deleted " + id);
    });

  });

});