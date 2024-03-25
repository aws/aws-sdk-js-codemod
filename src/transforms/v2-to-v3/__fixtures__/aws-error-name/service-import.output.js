import { S3 } from "@aws-sdk/client-s3";

const client = new S3();

try {
  await client.createBucket({
    Bucket: "bucket"
  });
} catch (error) {
  if (error.name === "BucketAlreadyExists") {
    // Handle BucketAlreadyExists error
  } else {
    throw error;
  }
}