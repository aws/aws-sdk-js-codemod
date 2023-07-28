import AWS_s3_request_presigner = require("@aws-sdk/s3-request-presigner");

const {
  getSignedUrl
} = AWS_s3_request_presigner;

import AWS_S3 = require("@aws-sdk/client-s3");

const {
  GetObjectCommand,
  S3
} = AWS_S3;

const s3 = new S3();

url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: "bucket", Key: "key" }));
url = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: "bucket",
  Key: "key"
}), {
  expiresIn: 60
});