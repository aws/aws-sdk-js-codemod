const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand, S3 } = require("@aws-sdk/client-s3");

const s3 = new S3();

url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: "bucket", Key: "key" }));
url = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: "bucket",
  Key: "key"
}), {
  expiresIn: 60
});