import { S3 } from "aws-sdk";

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await client.createBucket({ Bucket }).promise();
await client.waitFor("bucketExists", { Bucket }).promise();