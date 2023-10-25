import AWS from "aws-sdk";

const config = new AWS.Config({
  s3BucketEndpoint: true
});