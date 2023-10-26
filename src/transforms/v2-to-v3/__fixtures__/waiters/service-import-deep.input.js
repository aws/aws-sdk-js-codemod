import S3 from "aws-sdk/clients/s3";

const Bucket = "BUCKET_NAME";
const client = new S3();

await client.createBucket({ Bucket }).promise();

await client.waitFor("bucketExists", { Bucket }).promise();