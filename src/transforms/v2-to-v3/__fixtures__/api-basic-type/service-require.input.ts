const { S3 } = require("aws-sdk");

const testTags: typeof S3.Tag[] = [{ Key: "key", Value: "value" }];