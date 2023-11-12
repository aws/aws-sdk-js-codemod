import AWS from "aws-sdk";

const client = new AWS.DynamoDB({
  region: "us-west-2",
});