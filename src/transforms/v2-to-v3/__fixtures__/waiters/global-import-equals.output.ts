import AWS_S3 = require("@aws-sdk/client-s3");
import waitUntilBucketExists = AWS_S3.waitUntilBucketExists;
import S3 = AWS_S3.S3;

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await client.createBucket({ Bucket });

await waitUntilBucketExists({
  client,
  maxWaitTime: 200
}, { Bucket });