import { S3 } from "aws-sdk";

const Bucket = "bucket-name";

export const func = async (client: S3) => {
  try {
    await client.createBucket({ Bucket }).promise();
  } catch (error) {
    if (error.code === "BucketAlreadyExists") {
      // Handle BucketAlreadyExists error
    } else {
      throw error;
    }
  }
}

export const funcPromiseCatchArrowFn = async (client: S3) => {
  client
    .createBucket({ Bucket })
    .promise()
    .then((response) => {
      // Consume the response
    })
    .catch((error) => {
      if (error.code === "BucketAlreadyExists") {
        // Handle BucketAlreadyExists error
      } else {
        // Handle other error.
      }
    });
}

export const funcPromiseCatchFn = async (client: S3) => {
  client
    .createBucket({ Bucket })
    .promise()
    .then((response) => {
      // Consume the response
    })
    .catch(function (error) {
      if (error.code === "BucketAlreadyExists") {
        // Handle BucketAlreadyExists error
      } else {
        // Handle other error.
      }
    });
}