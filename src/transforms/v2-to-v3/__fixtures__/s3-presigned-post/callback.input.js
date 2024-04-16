import AWS from "aws-sdk";

const s3 = new AWS.S3();
const params = { Bucket: "bucket", Fields: { key: "key" } };

s3.createPresignedPost(params, function (err, data) {
  console.log('The URL is', data.url);
});