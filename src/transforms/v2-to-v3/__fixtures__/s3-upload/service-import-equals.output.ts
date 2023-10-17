import AWS_lib_storage = require("@aws-sdk/lib-storage");
import AWS_S3 = require("@aws-sdk/client-s3");

const client = new AWS_S3.S3({ region: "REGION" });
await new AWS_lib_storage.Upload({
  client,

  params: {
    Body: "BODY",
    Bucket: "Bucket",
    ContentType: "ContentType",
    Key: "Key",
  }
}).done();