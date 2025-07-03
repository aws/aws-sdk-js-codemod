import AWS from "aws-sdk";

import { S3 } from '@aws-sdk/client-s3';

const s3Client = new S3();
const ddbClient = new AWS.DynamoDB();
const lambdaClient = new AWS.Lambda();

s3Client.getObject({ Bucket: 'test', Key: 'test' });
ddbClient.scan({ TableName: 'test' }).promise();
lambdaClient.invoke({ FunctionName: 'test' }).promise();
