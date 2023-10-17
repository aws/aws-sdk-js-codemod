import AWS_lib_storage = require("@aws-sdk/lib-storage");
import Upload = AWS_lib_storage.Upload;
import AWS_S3 = require("@aws-sdk/client-s3");
import S3 = AWS_S3.S3;

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