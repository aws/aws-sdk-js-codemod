import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3();
const params = { Bucket: "bucket", Key: "key" };

// If 'Expires' is defined in params, it is ignored in existing transformation.
// Pass it as the 'expiresIn' value in the third argument of the getSignedUrl call.
url = await getSignedUrl(s3, new PutObjectCommand(params));
// If 'Expires' is defined in params, it is ignored in existing transformation.
// Pass it as the 'expiresIn' value in the third argument of the getSignedUrl call.
url = await getSignedUrl(s3, new PutObjectCommand(params));

url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: "bucket", Key: "key" }));
url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: "bucket", Key: "key" }), { expiresIn: 60 });