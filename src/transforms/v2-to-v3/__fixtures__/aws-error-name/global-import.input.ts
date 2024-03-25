import AWS from "aws-sdk";

export const func = async (client: AWS.S3) => {
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