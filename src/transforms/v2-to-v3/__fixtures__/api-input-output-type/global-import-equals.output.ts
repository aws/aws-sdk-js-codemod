import AWS_client_dynamodb = require("@aws-sdk/client-dynamodb");
import DynamoDB = AWS_client_dynamodb.DynamoDB;
import ListTablesCommandOutput = AWS_client_dynamodb.ListTablesCommandOutput;
import ListTablesCommandInput = AWS_client_dynamodb.ListTablesCommandInput;
import AWS_client_lambda = require("@aws-sdk/client-lambda");
import Lambda = AWS_client_lambda.Lambda;
import InvokeCommandOutput = AWS_client_lambda.InvokeCommandOutput;
import InvokeCommandInput = AWS_client_lambda.InvokeCommandInput;
import AWS_client_sts = require("@aws-sdk/client-sts");
import STS = AWS_client_sts.STS;
import GetCallerIdentityCommandOutput = AWS_client_sts.GetCallerIdentityCommandOutput;
import GetCallerIdentityCommandInput = AWS_client_sts.GetCallerIdentityCommandInput;

const ddbClient = new DynamoDB({ region: "us-west-2" });
const listTablesInput: ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: ListTablesCommandOutput = await ddbClient
  .listTables(listTablesInput);

const stsClient = new STS({ region: "us-west-2" });
const getCallerIdentityInput: GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: GetCallerIdentityCommandOutput = await stsClient
  .getCallerIdentity(getCallerIdentityInput);

const lambdaClient = new Lambda({ region: "us-west-2" });
const invokeInput: InvokeCommandInput = { FunctionName: "my-function" };
const invokeOutput: InvokeCommandOutput = await lambdaClient
  .invoke(invokeInput);