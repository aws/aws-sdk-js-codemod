import DynamoDB = require("aws-sdk/clients/dynamodb");
import Lambda = require("aws-sdk/clients/lambda");
import STS = require("aws-sdk/clients/sts");

const listTablesInput: DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: DynamoDB.ListTablesOutput = {};

const getCallerIdentityInput: STS.GetCallerIdentityRequest = {};
const getCallerIdentityOutput: STS.GetCallerIdentityResponse = {};

const invokeInput: Lambda.InvocationRequest = { FunctionName: "my-function" };
const invokeOutput: Lambda.InvocationResponse = {};