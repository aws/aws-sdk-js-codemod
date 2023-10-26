import AWS from "aws-sdk";

const client = new AWS.S3();

const uploadParams = {
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
};
const uploadOptions = {
  partSize: 1024 * 1024 * 5,
  queueSize: 1,
  leavePartsOnError: true,
  tags: [],
};

await client.upload(uploadParams, uploadOptions).promise();