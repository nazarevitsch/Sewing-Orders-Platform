'use strict';

require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});


async function uploadFile(fileLocation) {
  let file = fs.readFileSync(fileLocation);
  return s3.upload({
    Bucket: bucketName,
    ACL: 'public-read',
    Key: new Date().toISOString(),
    Body: file
  }).promise()
    .then(data => {
      fs.unlinkSync(fileLocation);
      return data.Location;
    })
}

module.exports = {
  uploadFile
};
