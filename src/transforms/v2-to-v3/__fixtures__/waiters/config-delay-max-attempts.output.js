import { S3, waitUntilBucketExists } from "@aws-sdk/client-s3";

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await client.createBucket({ Bucket });

await waitUntilBucketExists({
  client,
  minDelay: 2,
  maxWaitTime: 20
}, {
  Bucket
});