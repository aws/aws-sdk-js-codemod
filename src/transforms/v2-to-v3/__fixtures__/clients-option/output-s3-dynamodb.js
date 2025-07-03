import AWS from "aws-sdk";

import { DynamoDB } from '@aws-sdk/client-dynamodb';

import { S3 } from '@aws-sdk/client-s3';

const s3Client = new S3();
const ddbClient = new DynamoDB();
const lambdaClient = new AWS.Lambda();

s3Client.getObject({ Bucket: 'test', Key: 'test' });
ddbClient.scan({ TableName: 'test' });
lambdaClient.invoke({ FunctionName: 'test' }).promise();
