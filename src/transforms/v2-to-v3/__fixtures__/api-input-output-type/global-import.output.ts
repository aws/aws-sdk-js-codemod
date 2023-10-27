import { ListTablesCommandInput, ListTablesCommandOutput } from "@aws-sdk/client-dynamodb";
import { InvokeCommandInput, InvokeCommandOutput } from "@aws-sdk/client-lambda";
import { GetCallerIdentityCommandInput, GetCallerIdentityCommandOutput } from "@aws-sdk/client-sts";

const listTablesInput: ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: ListTablesCommandOutput = {};

const getCallerIdentityInput: GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: GetCallerIdentityCommandOutput = {};

const invokeInput: InvokeCommandInput = { FunctionName: "my-function" };
const invokeOutput: InvokeCommandOutput = {};