import AWS = require("aws-sdk");

const Bucket = "BUCKET_NAME";
const client = new AWS.S3({ region: "REGION" });

await client.waitFor("bucketNotExists", { Bucket }).promise();
await client.createBucket({ Bucket }).promise();
await client.waitFor("bucketExists", { Bucket }).promise();