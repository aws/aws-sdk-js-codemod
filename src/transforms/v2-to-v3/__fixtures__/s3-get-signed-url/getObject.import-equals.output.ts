import AWS_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
import AWS_S3 = require("@aws-sdk/client-s3");

const s3 = new AWS_S3.S3();

url = await AWS_s3_request_presigner.getSignedUrl(s3, new AWS_S3.GetObjectCommand({ Bucket: "bucket", Key: "key" }));
url = await AWS_s3_request_presigner.getSignedUrl(s3, new AWS_S3.GetObjectCommand({
  Bucket: "bucket",
  Key: "key"
}), {
  expiresIn: 60
});