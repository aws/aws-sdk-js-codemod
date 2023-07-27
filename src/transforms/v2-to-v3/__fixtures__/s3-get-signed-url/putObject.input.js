import AWS from "aws-sdk";

const s3 = new AWS.S3();
const params = { Bucket: "bucket", Key: "key" };

url = s3.getSignedUrl("putObject", params);
url = await s3.getSignedUrlPromise("putObject", params);

url = s3.getSignedUrl("putObject", { Bucket: "bucket", Key: "key" });
url = s3.getSignedUrl("putObject", { Bucket: "bucket", Key: "key", Expires: 60 });