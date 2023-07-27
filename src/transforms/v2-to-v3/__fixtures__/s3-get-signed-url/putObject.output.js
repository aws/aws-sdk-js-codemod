import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3({});
const params = { Bucket: "bucket", Key: "key" };

// If Expires is defined in params, it will be ignored. Please pass expiresIn as the third argument.
url = await getSignedUrl(s3, new PutObjectCommand(params));
// If Expires is defined in params, it will be ignored. Please pass expiresIn as the third argument.
url = await getSignedUrl(s3, new PutObjectCommand(params));

url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: "bucket", Key: "key" }), { expiresIn: 60 });