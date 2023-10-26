import AWS from "aws-sdk";

const Bucket = "BUCKET_NAME";
const client = new AWS.S3();

await client.createBucket({ Bucket }).promise();

await client.waitFor("bucketExists", { Bucket }).promise();