import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

const client = new S3({ region: "REGION" });

const uploadParams = {
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
};
const uploadOptions = {
  partSize: 1024 * 1024 * 5,
  queueSize: 1,
  leavePartsOnError: true,
  tags: [],
};

await new Upload({
  client,
  params: uploadParams,
  ...uploadOptions
}).done();