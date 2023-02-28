const {
  S3,
  waitUntilBucketExists,
  waitUntilBucketNotExists
} = require("@aws-sdk/client-s3");

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await waitUntilBucketNotExists({
  client,
  maxWaitTime: 200
}, { Bucket });
await client.createBucket({ Bucket });
await waitUntilBucketExists({
  client,
  maxWaitTime: 200
}, { Bucket });