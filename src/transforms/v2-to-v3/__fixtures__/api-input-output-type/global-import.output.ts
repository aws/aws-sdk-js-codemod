import { DynamoDB, ListTablesCommandInput, ListTablesCommandOutput } from "@aws-sdk/client-dynamodb";
import { InvokeCommandInput, InvokeCommandOutput, Lambda } from "@aws-sdk/client-lambda";
import { GetCallerIdentityCommandInput, GetCallerIdentityCommandOutput, STS } from "@aws-sdk/client-sts";

const ddbClient = new DynamoDB();
const listTablesInput: ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: ListTablesCommandOutput = await ddbClient
  .listTables(listTablesInput);

const stsClient = new STS();
const getCallerIdentityInput: GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: GetCallerIdentityCommandOutput = await stsClient
  .getCallerIdentity(getCallerIdentityInput);

const lambdaClient = new Lambda();
const invokeInput: InvokeCommandInput = { FunctionName: "my-function" };
const invokeOutput: InvokeCommandOutput = await lambdaClient
  .invoke(invokeInput);