import { S3 as S3Client, waitUntilBucketExists } from "@aws-sdk/client-s3";

const Bucket = "BUCKET_NAME";
const client = new S3Client({ region: "REGION" });

await client.createBucket({ Bucket });
await waitUntilBucketExists({
  client,
  maxWaitTime: 180
}, { Bucket });