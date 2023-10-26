import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

const client = new S3();
const uploadParams = {
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
};

await new Upload({
  client,
  params: uploadParams
}).done();