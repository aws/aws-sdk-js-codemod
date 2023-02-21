import AWS_S3 = require("@aws-sdk/client-s3");

const {
  S3,
  waitUntilBucketExists,
  waitUntilBucketNotExists
} = AWS_S3;

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await waitUntilBucketNotExists({
  client,
  maxWaitTime: 180
}, { Bucket });
await client.createBucket({ Bucket });
await waitUntilBucketExists({
  client,
  maxWaitTime: 180
}, { Bucket });