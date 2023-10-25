import AWS from "aws-sdk";

const config = new AWS.Config({
  retryDelayOptions: { base: 300 }
});