const S3 = require("aws-sdk").S3;

const client = new S3();
await client.upload({
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
}).promise();