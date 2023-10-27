import AWS from "aws-sdk";

const client = new AWS.DynamoDB({
  accessKeyId: "KEY",
  secretAccessKey: "SECRET"
});