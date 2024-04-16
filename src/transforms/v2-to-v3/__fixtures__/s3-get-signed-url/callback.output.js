import AWS from "aws-sdk";

const s3 = new AWS.S3();
const params = { Bucket: "bucket", Key: "key" };

// S3 getSignedUrl with callbacks is not supported in AWS SDK for JavaScript (v3).
// Please convert to 'client.getSignedUrl(apiName, options)', and re-run aws-sdk-js-codemod.
s3.getSignedUrl("getObject", params, function (err, url) {
  console.log('The URL is', url);
});