import S3 = require("aws-sdk/clients/s3");

const testTags: S3.Types.Tag[] = [{ Key: "key", Value: "value" }];