import AWS_S3 = require("@aws-sdk/client-s3");

const Bucket = "BUCKET_NAME";
const client = new AWS_S3.S3({ region: "REGION" });

await client.createBucket({ Bucket });

await AWS_S3.waitUntilBucketExists({
  client,
  maxWaitTime: 200
}, { Bucket });