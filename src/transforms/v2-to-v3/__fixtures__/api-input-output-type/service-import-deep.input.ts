import DynamoDB, { ListTablesInput, ListTablesOutput } from "aws-sdk/clients/dynamodb";
import STS, { GetCallerIdentityRequest, GetCallerIdentityResponse } from "aws-sdk/clients/sts";

const ddbClient = new DynamoDB({ region: "us-west-2" });
const listTablesInput: ListTablesInput = { Limit: 10 };
const listTablesOutput: ListTablesOutput = await ddbClient
  .listTables(listTablesInput)
  .promise();

const stsClient = new STS({ region: "us-west-2" });
const getCallerIdentityInput: GetCallerIdentityRequest = {};
const getCallerIdentityOutput: GetCallerIdentityResponse = await stsClient
  .getCallerIdentity(getCallerIdentityInput)
  .promise();