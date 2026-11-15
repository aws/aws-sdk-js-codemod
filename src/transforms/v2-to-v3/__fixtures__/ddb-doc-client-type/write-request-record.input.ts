import AWS from "aws-sdk";

const raw: AWS.DynamoDB.BatchWriteItemRequestMap = {};
const document: AWS.DynamoDB.DocumentClient.BatchWriteItemRequestMap = { table: [{ PutRequest: { Item: { pk: "native" } } }] };
