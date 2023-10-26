import AWS from "aws-sdk";

const Bucket = "BUCKET_NAME";
const client = new AWS.S3();

client.waitFor("bucketExists", { Bucket }, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});