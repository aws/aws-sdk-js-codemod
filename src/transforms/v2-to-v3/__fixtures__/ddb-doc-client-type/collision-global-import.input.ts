import AWS from "aws-sdk";

const raw: AWS.DynamoDB.WriteRequest = { PutRequest: { Item: { pk: { S: "raw" } } } };
const document: AWS.DynamoDB.DocumentClient.WriteRequest = { PutRequest: { Item: { pk: "document" } } };
