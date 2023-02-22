import { S3, waitUntilBucketExists, waitUntilBucketNotExists } from "@aws-sdk/client-s3";

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

// Waiter configuration delay
await waitUntilBucketExists({
  client,
  minDelay: 2,
  maxWaitTime: 180
}, {
  Bucket
});