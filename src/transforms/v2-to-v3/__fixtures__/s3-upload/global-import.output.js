import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const client = new S3({ region: "REGION" });
await new Upload({
  client,
  params: {
    Body: "BODY",
    Bucket: "Bucket",
    ContentType: "ContentType",
    Key: "Key",
  },
}).done();