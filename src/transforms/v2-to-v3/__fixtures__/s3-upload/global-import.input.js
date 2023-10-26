import AWS from "aws-sdk";

const client = new AWS.S3();
await client.upload({
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
}).promise();