import { ListTablesInput, ListTablesOutput } from "aws-sdk/clients/dynamodb";
import { InvocationRequest, InvocationResponse } from "aws-sdk/clients/lambda";
import { GetCallerIdentityRequest, GetCallerIdentityResponse } from "aws-sdk/clients/sts";

const listTablesInput: ListTablesInput = { Limit: 10 };
const listTablesOutput: ListTablesOutput = {};

const getCallerIdentityInput: GetCallerIdentityRequest = {};
const getCallerIdentityOutput: GetCallerIdentityResponse = {};

const invokeInput: InvocationRequest = { FunctionName: "my-function" };
const invokeOutput: InvocationResponse = {};