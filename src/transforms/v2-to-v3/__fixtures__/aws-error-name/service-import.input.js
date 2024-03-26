import { S3 } from "aws-sdk";

const client = new S3();
const Bucket = "bucket-name";

try {
  await client.createBucket({ Bucket }).promise();
} catch (error) {
  if (error.code === "BucketAlreadyExists") {
    // Handle BucketAlreadyExists error
  } else {
    throw error;
  }
}

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

client
  .createBucket({ Bucket })
  .promise()
  .then(
    (response) => {
      // Consume the response
    },
    (error) => {
      if (error.code === "BucketAlreadyExists") {
        // Handle BucketAlreadyExists error
      } else {
        // Handle other error.
      }
    }
  );
