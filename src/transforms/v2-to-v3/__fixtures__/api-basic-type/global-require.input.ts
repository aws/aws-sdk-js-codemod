const AWS = require("aws-sdk");

const testTags: typeof AWS.S3.Tag[] = [{ Key: "key", Value: "value" }];