import AWS from "aws-sdk";

import { S3 } from '@aws-sdk/client-s3';

const s3Client = new S3();
const ddbClient = new AWS.DynamoDB();
const lambdaClient = new AWS.Lambda();

// Test operations
s3Client.getObject({ Bucket: 'test', Key: 'test' });
// The `.promise()` call might be on an JS SDK v2 client API.
// If yes, please remove .promise(). If not, remove this comment.
ddbClient.scan({ TableName: 'test' }).promise();
// The `.promise()` call might be on an JS SDK v2 client API.
// If yes, please remove .promise(). If not, remove this comment.
lambdaClient.invoke({ FunctionName: 'test' }).promise();
