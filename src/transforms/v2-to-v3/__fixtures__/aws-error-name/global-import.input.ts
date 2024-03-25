import AWS from "aws-sdk";

const Bucket = "bucket-name";

export const funcTryCatch = async (client: AWS.S3) => {
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

export const funcPromiseCatchArrowFn = async (client: AWS.S3) => {
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

export const funcPromiseCatchFn = async (client: AWS.S3) => {
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