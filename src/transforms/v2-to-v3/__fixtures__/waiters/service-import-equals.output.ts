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
  maxWaitTime: 200
}, { Bucket });
await client.createBucket({ Bucket });
await waitUntilBucketExists({
  client,
  maxWaitTime: 200
}, { Bucket });

// Waiter configuration: delay
await waitUntilBucketExists({
  client,
  minDelay: 2,
  maxWaitTime: 40
}, {
  Bucket
});

// Waiter configuration: maxAttempts
await waitUntilBucketExists({
  client,
  maxWaitTime: 100
}, {
  Bucket
});

// Waiter configuration: delay+maxAttempts
await waitUntilBucketExists({
  client,
  minDelay: 2,
  maxWaitTime: 20
}, {
  Bucket
});