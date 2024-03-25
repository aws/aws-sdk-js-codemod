import { S3 } from "aws-sdk";

export const func = async (client: S3) => {
  try {
    await client.createBucket({
      Bucket: "bucket"
    }).promise();
  } catch (error) {
    if (error.code === "BucketAlreadyExists") {
      // Handle BucketAlreadyExists error
    } else {
      throw error;
    }
  }
}