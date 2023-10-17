import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");
import AWS_Lambda = require("@aws-sdk/client-lambda");
import AWS_STS = require("@aws-sdk/client-sts");

const ddbClient = new AWS_DynamoDB.DynamoDB({ region: "us-west-2" });
const listTablesInput: AWS_DynamoDB.ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: AWS_DynamoDB.ListTablesCommandOutput = await ddbClient
  .listTables(listTablesInput);

const stsClient = new AWS_STS.STS({ region: "us-west-2" });
const getCallerIdentityInput: AWS_STS.GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: AWS_STS.GetCallerIdentityCommandOutput = await stsClient
  .getCallerIdentity(getCallerIdentityInput);

const lambdaClient = new AWS_Lambda.Lambda({ region: "us-west-2" });
const invokeInput: AWS_Lambda.InvokeCommandInput = { FunctionName: "my-function" };
const invokeOutput: AWS_Lambda.InvokeCommandOutput = await lambdaClient
  .invoke(invokeInput);