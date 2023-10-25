import AWS from "aws-sdk";

const config = new AWS.Config({
  useAccelerateEndpoint: "us-east-1"
});