import AWS = require("aws-sdk");

const ddbClient = new AWS.DynamoDB();
const listTablesInput: AWS.DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: AWS.DynamoDB.ListTablesOutput = await ddbClient
  .listTables(listTablesInput)
  .promise();

const stsClient = new AWS.STS();
const getCallerIdentityInput: AWS.STS.GetCallerIdentityRequest = {};
const getCallerIdentityOutput: AWS.STS.GetCallerIdentityResponse = await stsClient
  .getCallerIdentity(getCallerIdentityInput)
  .promise();

const lambdaClient = new AWS.Lambda();
const invokeInput: AWS.Lambda.InvocationRequest = { FunctionName: "my-function" };
const invokeOutput: AWS.Lambda.InvocationResponse = await lambdaClient
  .invoke(invokeInput)
  .promise();