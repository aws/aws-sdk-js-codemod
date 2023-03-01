import AWS from "aws-sdk";

const client = new AWS.S3({ region: "REGION" });
await client
  .upload(
    {
      Body: "BODY",
      Bucket: "Bucket",
      ContentType: "ContentType",
      Key: "Key",
    },
    {
      partSize: 1024 * 1024 * 5,
      queueSize: 1,
      leavePartsOnError: true,
      tags: [],
    }
  )
  .promise();