import AWS_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
import getSignedUrl = AWS_s3_request_presigner.getSignedUrl;
import AWS_client_s3 = require("@aws-sdk/client-s3");
import GetObjectCommand = AWS_client_s3.GetObjectCommand;
import S3 = AWS_client_s3.S3;

const s3 = new S3();

url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: "bucket", Key: "key" }));
url = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: "bucket",
  Key: "key"
}), {
  expiresIn: 60
});