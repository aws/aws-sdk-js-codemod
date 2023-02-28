const S3 = require("aws-sdk").S3;

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await client.waitFor("bucketNotExists", { Bucket }).promise();
await client.createBucket({ Bucket }).promise();
await client.waitFor("bucketExists", { Bucket }).promise();

// Waiter configuration: delay+maxAttempts
await client.waitFor("bucketExists", { Bucket, $waiter: { delay: 2, maxAttempts: 5 } }).promise();