import AWS from "aws-sdk";

const Bucket = "BUCKET_NAME";
const client = new AWS.S3({ region: "REGION" });

await client.waitFor("bucketNotExists", { Bucket }).promise();
await client.createBucket({ Bucket }).promise();
await client.waitFor("bucketExists", { Bucket }).promise();

// Waiter configuration: delay
await client.waitFor("bucketExists", { Bucket, $waiter: { delay: 2 } }).promise();

// Waiter configuration: maxAttempts
await client.waitFor("bucketExists", { Bucket, $waiter: { maxAttempts: 5 } }).promise();

// Waiter configuration: delay+maxAttempts
await client.waitFor("bucketExists", { Bucket, $waiter: { delay: 2, maxAttempts: 5 } }).promise();