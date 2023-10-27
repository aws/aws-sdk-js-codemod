import AWS_client_dynamodb = require("@aws-sdk/client-dynamodb");
import ListTablesCommandOutput = AWS_client_dynamodb.ListTablesCommandOutput;
import ListTablesCommandInput = AWS_client_dynamodb.ListTablesCommandInput;
import AWS_client_lambda = require("@aws-sdk/client-lambda");
import InvokeCommandOutput = AWS_client_lambda.InvokeCommandOutput;
import InvokeCommandInput = AWS_client_lambda.InvokeCommandInput;
import AWS_client_sts = require("@aws-sdk/client-sts");
import GetCallerIdentityCommandOutput = AWS_client_sts.GetCallerIdentityCommandOutput;
import GetCallerIdentityCommandInput = AWS_client_sts.GetCallerIdentityCommandInput;

const listTablesInput: ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: ListTablesCommandOutput = {};

const getCallerIdentityInput: GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: GetCallerIdentityCommandOutput = {};

const invokeInput: InvokeCommandInput = { FunctionName: "my-function" };
const invokeOutput: InvokeCommandOutput = {};