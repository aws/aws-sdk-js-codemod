import AWS_S3 = require("@aws-sdk/client-s3");

const {
  S3
} = AWS_S3;

const testTags: AWS_S3.Tag[] = [{ Key: "key", Value: "value" }];