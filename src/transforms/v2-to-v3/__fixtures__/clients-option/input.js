import AWS from "aws-sdk";

const s3Client = new AWS.S3();
const ddbClient = new AWS.DynamoDB();
const lambdaClient = new AWS.Lambda();

s3Client.getObject({ Bucket: 'test', Key: 'test' }).promise();
ddbClient.scan({ TableName: 'test' }).promise();
lambdaClient.invoke({ FunctionName: 'test' }).promise();
