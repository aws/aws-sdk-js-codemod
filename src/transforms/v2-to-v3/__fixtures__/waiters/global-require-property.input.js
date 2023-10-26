const S3 = require("aws-sdk").S3;

const Bucket = "BUCKET_NAME";
const client = new S3();

await client.createBucket({ Bucket }).promise();

await client.waitFor("bucketExists", { Bucket }).promise();