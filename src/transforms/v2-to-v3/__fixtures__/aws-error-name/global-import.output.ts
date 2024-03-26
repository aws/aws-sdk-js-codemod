import { S3 } from "@aws-sdk/client-s3";

const Bucket = "bucket-name";

export const funcTryCatch = async (client: S3) => {
  try {
    await client.createBucket({ Bucket });
  } catch (error) {
    if (error.name === "BucketAlreadyExists") {
      // Handle BucketAlreadyExists error
    } else {
      throw error;
    }
  }
}

export const funcPromiseCatchArrowFn = async (client: S3) => {
  client
    .createBucket({ Bucket })
    .then((response) => {
      // Consume the response
    })
    .catch((error) => {
      if (error.name === "BucketAlreadyExists") {
        // Handle BucketAlreadyExists error
      } else {
        // Handle other error.
      }
    });
}

export const funcPromiseCatchFn = async (client: S3) => {
  client
    .createBucket({ Bucket })
    .then((response) => {
      // Consume the response
    })
    .catch(function (error) {
      if (error.name === "BucketAlreadyExists") {
        // Handle BucketAlreadyExists error
      } else {
        // Handle other error.
      }
    });
}

export const funcPromiseCatchCallback = async (client: S3) => {
  client
    .createBucket({ Bucket })
    .then(
      (response) => {
        // Consume the response
      },
      (error) => {
        if (error.name === "BucketAlreadyExists") {
          // Handle BucketAlreadyExists error
        } else {
          // Handle other error.
        }
      }
    );
}
