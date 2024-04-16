import AWS from "aws-sdk";

const s3 = new AWS.S3();
const params = { Bucket: "bucket", Fields: { key: "key" } };

// S3 createPresignedPost with callbacks is not supported in AWS SDK for JavaScript (v3).
// Please convert to 'client.createPresignedPost(params)', and re-run aws-sdk-js-codemod.
s3.createPresignedPost(params, function (err, data) {
  console.log('The URL is', data.url);
});