import AWS from "aws-sdk";

const client = new AWS.S3();
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

client.createBucket({ Bucket }, (error, response) => {
  if (error) {
    if (error.code === "BucketAlreadyExists") {
      // Handle BucketAlreadyExists error
    } else {
      // Handle other error.
    }
  } else {
    // Consume the response
  }
});
