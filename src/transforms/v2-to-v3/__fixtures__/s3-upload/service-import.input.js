import { S3 } from "aws-sdk";

const client = new S3();
await client.upload({
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key"
}).promise();