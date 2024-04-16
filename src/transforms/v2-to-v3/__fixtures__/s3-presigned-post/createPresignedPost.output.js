import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3 } from "@aws-sdk/client-s3";

const client = new S3();
const response = await createPresignedPost(client, params);
