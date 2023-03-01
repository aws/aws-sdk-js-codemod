import AWS from "aws-sdk";

const client = new AWS.S3({ region: "REGION" });
const uploadParams = {
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
};

// S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
// Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
client.upload(uploadParams, (err, data) => {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});