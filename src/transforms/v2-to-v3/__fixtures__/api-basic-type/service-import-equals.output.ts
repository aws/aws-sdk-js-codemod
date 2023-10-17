import AWS_S3 = require("@aws-sdk/client-s3");
import Tag = AWS_S3.Tag;

const testTags: Tag[] = [{ Key: "key", Value: "value" }];