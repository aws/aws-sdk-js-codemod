import AWS from "aws-sdk";

const s3 = new AWS.S3();
const params = { Bucket: "bucket", Key: "key" };

url = await s3.getSignedUrlPromise("getObject", params);

url = await s3.getSignedUrlPromise("getObject", { Bucket: "bucket", Key: "key" });
url = await s3.getSignedUrlPromise("getObject", { Bucket: "bucket", Key: "key", Expires: 60 });