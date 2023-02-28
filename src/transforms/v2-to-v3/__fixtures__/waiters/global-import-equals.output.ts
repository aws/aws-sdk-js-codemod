import AWS_S3 = require("@aws-sdk/client-s3");

const {
  S3,
  waitUntilBucketExists
} = AWS_S3;

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await client.createBucket({ Bucket });
await waitUntilBucketExists({
  client,
  maxWaitTime: 200
}, { Bucket });