import AWS from "aws-sdk";

const config = new AWS.Config({
  correctClockSkew: true
});