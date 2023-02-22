import AWS_lib_storage = require("@aws-sdk/lib-storage");

const {
  Upload
} = AWS_lib_storage;

import AWS_S3 = require("@aws-sdk/client-s3");

const {
  S3
} = AWS_S3;

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