import AWS from "aws-sdk";

const config = new AWS.Config({
  s3UsEast1RegionalEndpoint: "legacy"
});