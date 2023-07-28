import AWS from "aws-sdk";

const s3 = new AWS.S3();
const params = { Bucket: "bucket", Key: "key" };

url = s3.getSignedUrl("getObject", params);