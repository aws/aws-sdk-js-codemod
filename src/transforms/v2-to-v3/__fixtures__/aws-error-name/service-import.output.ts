import { S3 } from "@aws-sdk/client-s3";

export const func = async (client: S3) => {
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
}