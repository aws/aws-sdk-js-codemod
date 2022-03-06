import AWS from "aws-sdk";

const region = "us-west-2";

const dynamodbClient = new AWS.DynamoDB({ region });
const s3Client = new AWS.S3({ region });