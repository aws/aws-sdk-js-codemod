const { S3 } = require("aws-sdk");

const testTags: S3.Tag[] = [{ Key: "key", Value: "value" }];