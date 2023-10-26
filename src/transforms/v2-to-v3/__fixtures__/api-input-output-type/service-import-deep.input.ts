import DynamoDB, { ListTablesInput, ListTablesOutput } from "aws-sdk/clients/dynamodb";
import Lambda, { InvocationRequest, InvocationResponse } from "aws-sdk/clients/lambda";
import STS, { GetCallerIdentityRequest, GetCallerIdentityResponse } from "aws-sdk/clients/sts";

const ddbClient = new DynamoDB();
const listTablesInput: ListTablesInput = { Limit: 10 };
const listTablesOutput: ListTablesOutput = await ddbClient
  .listTables(listTablesInput)
  .promise();

const stsClient = new STS();
const getCallerIdentityInput: GetCallerIdentityRequest = {};
const getCallerIdentityOutput: GetCallerIdentityResponse = await stsClient
  .getCallerIdentity(getCallerIdentityInput)
  .promise();

const lambdaClient = new Lambda();
const invokeInput: InvocationRequest = { FunctionName: "my-function" };
const invokeOutput: InvocationResponse = await lambdaClient
  .invoke(invokeInput)
  .promise();