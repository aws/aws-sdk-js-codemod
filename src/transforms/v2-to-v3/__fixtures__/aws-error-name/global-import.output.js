import { S3 } from "@aws-sdk/client-s3";

const client = new S3();
const Bucket = "bucket-name";

try {
  await client.createBucket({ Bucket });
} catch (error) {
  if (error.name === "BucketAlreadyExists") {
    // Handle BucketAlreadyExists error
  } else {
    throw error;
  }
}

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