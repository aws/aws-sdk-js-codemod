import AWS from "aws-sdk";

const s3 = new AWS.S3();

url = s3.getSignedUrl("putObject", { Bucket: "bucket", Key: "key" });
url = s3.getSignedUrl("putObject", { Bucket: "bucket", Key: "key", Expires: 60 });