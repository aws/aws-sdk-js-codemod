import * as AWS_DynamoDB from "@aws-sdk/client-dynamodb";

const {
  DynamoDB
} = AWS_DynamoDB;

import * as AWS_STS from "@aws-sdk/client-sts";

const {
  STS
} = AWS_STS;

import * as AWS_Lambda from "@aws-sdk/client-lambda";

const {
  Lambda
} = AWS_Lambda;

const ddbClient = new DynamoDB({ region: "us-west-2" });
const listTablesInput: AWS_DynamoDB.ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: AWS_DynamoDB.ListTablesCommandOutput = await ddbClient
  .listTables(listTablesInput);

const stsClient = new STS({ region: "us-west-2" });
const getCallerIdentityInput: AWS_STS.GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: AWS_STS.GetCallerIdentityCommandOutput = await stsClient
  .getCallerIdentity(getCallerIdentityInput);

const lambdaClient = new Lambda({ region: "us-west-2" });
const invokeInput: AWS_Lambda.InvokeCommandInput = { FunctionName: "my-function" };
const invokeOutput: AWS_Lambda.InvokeCommandOutput = await lambdaClient
  .invoke(invokeInput);