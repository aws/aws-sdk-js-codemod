import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";

const s3 = new S3();

url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: "bucket", Key: "key" }));
url = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: "bucket",
  Key: "key"
}), {
  expiresIn: 60
});