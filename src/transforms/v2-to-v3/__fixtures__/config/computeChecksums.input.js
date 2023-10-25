import AWS from "aws-sdk";

const config = new AWS.Config({
  computeChecksums: true
});