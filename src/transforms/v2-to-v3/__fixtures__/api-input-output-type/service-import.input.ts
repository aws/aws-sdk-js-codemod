import { DynamoDB, Lambda, STS } from "aws-sdk";

const listTablesInput: DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: DynamoDB.ListTablesOutput = {};

const getCallerIdentityInput: STS.GetCallerIdentityRequest = {};
const getCallerIdentityOutput: STS.GetCallerIdentityResponse = {};

const invokeInput: Lambda.InvocationRequest = { FunctionName: "my-function" };
const invokeOutput: Lambda.InvocationResponse = {};
  