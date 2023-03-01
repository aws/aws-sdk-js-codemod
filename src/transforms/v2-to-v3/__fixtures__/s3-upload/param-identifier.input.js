import AWS from "aws-sdk";

const client = new AWS.S3({ region: "REGION" });
const uploadParams = {
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
};

await client.upload(uploadParams).promise();