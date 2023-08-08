const AWS_S3 = require("@aws-sdk/client-s3");

const testTags: typeof AWS_S3.Tag[] = [{ Key: "key", Value: "value" }];