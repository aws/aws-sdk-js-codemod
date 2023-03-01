import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

const client = new S3({ region: "REGION" });
await new Upload({
  client,

  params: {
    Body: "BODY",
    Bucket: "Bucket",
    ContentType: "ContentType",
    Key: "Key",
  },

  partSize: 1024 * 1024 * 5,
  queueSize: 1,
  leavePartsOnError: true,
  tags: []
})
  .done();