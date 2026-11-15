import AWS from "aws-sdk";

const raw: AWS.DynamoDB.WriteRequests = [];
const document: AWS.DynamoDB.DocumentClient.WriteRequests = [];
const more: AWS.DynamoDB.DocumentClient.WriteRequest = {};
