const {
        Upload
      } = require("@aws-sdk/lib-storage"),
      {
        S3
      } = require("@aws-sdk/client-s3");

const client = new S3({ region: "REGION" });
await new Upload({
  client,

  params: {
    Body: "BODY",
    Bucket: "Bucket",
    ContentType: "ContentType",
    Key: "Key",
  }
}).done();