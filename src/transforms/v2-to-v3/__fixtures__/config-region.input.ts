import AWS from "aws-sdk";

AWS.config.region = "us-west-2";
const dynamodbClient = new AWS.DynamoDB();
const s3Client = new AWS.S3();