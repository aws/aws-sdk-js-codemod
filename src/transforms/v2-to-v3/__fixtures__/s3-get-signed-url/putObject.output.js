import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";

const s3 = new S3();
const params = { Bucket: "bucket", Key: "key" };

url = await getSignedUrl(s3, new PutObjectCommand(params), { expiresIn: 900 });

url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: "bucket", Key: "key" }));
url = await getSignedUrl(s3, new PutObjectCommand({
  Bucket: "bucket",
  Key: "key"
}), {
  expiresIn: 60
});