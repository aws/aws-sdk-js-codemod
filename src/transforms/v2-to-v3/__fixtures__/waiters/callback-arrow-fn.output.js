import AWS from "aws-sdk";

const Bucket = "BUCKET_NAME";
const client = new AWS.S3({ region: "REGION" });

// Waiters with callbacks are not supported in AWS SDK for JavaScript (v3).
// Please convert to `await client.waitFor(state, params).promise()`, and re-run aws-sdk-js-codemod.
client.waitFor("bucketExists", { Bucket }, (err, data) => {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});