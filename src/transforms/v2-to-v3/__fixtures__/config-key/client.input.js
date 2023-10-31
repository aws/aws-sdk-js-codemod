import AWS from "aws-sdk";

AWS.config.region = "us-west-2";

const client = new AWS.DynamoDB();