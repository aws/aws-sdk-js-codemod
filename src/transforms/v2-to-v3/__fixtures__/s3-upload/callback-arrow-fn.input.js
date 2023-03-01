import AWS from "aws-sdk";

const client = new AWS.S3({ region: "REGION" });
const uploadParams = {
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
};

client.upload(uploadParams, (err, data) => {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});