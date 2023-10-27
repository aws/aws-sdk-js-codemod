import AWS = require("aws-sdk");

const listTablesInput: AWS.DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: AWS.DynamoDB.ListTablesOutput = {};

const getCallerIdentityInput: AWS.STS.GetCallerIdentityRequest = {};
const getCallerIdentityOutput: AWS.STS.GetCallerIdentityResponse = {};

const invokeInput: AWS.Lambda.InvocationRequest = { FunctionName: "my-function" };
const invokeOutput: AWS.Lambda.InvocationResponse = {};