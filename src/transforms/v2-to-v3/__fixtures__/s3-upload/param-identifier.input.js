import AWS from "aws-sdk";

const client = new AWS.S3();
const uploadParams = {
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key"
};

await client.upload(uploadParams).promise();