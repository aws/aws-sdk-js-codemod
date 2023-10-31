import AWS from "aws-sdk";

AWS.config.update({ region: "us-west-2" });

const client = new AWS.Config({
  logger: console
});