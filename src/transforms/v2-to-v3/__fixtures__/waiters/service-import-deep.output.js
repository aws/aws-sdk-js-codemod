import { S3, waitUntilBucketExists } from "@aws-sdk/client-s3";

const Bucket = "BUCKET_NAME";
const client = new S3();

await client.createBucket({ Bucket });

await waitUntilBucketExists({
  client,
  maxWaitTime: 200
}, { Bucket });