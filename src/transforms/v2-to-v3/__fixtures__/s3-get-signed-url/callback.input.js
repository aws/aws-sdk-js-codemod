import AWS from "aws-sdk";

const s3 = new AWS.S3();
const params = { Bucket: "bucket", Key: "key" };

s3.getSignedUrl("getObject", params, function (err, url) {
  console.log('The URL is', url);
});