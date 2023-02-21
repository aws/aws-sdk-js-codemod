import S3Client from "aws-sdk/clients/s3";

const Bucket = "BUCKET_NAME";
const client = new S3Client({ region: "REGION" });

await client.createBucket({ Bucket }).promise();
await client.waitFor("bucketExists", { Bucket }).promise();