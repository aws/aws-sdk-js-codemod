import AWS from "aws-sdk";

const config = new AWS.Config({
  maxRetries: 5
});