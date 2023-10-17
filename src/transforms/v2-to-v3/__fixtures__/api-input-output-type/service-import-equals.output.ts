import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");
import DynamoDB = AWS_DynamoDB.DynamoDB;
import ListTablesCommandOutput = AWS_DynamoDB.ListTablesCommandOutput;
import ListTablesCommandInput = AWS_DynamoDB.ListTablesCommandInput;
import AWS_Lambda = require("@aws-sdk/client-lambda");
import Lambda = AWS_Lambda.Lambda;
import InvokeCommandOutput = AWS_Lambda.InvokeCommandOutput;
import InvokeCommandInput = AWS_Lambda.InvokeCommandInput;
import AWS_STS = require("@aws-sdk/client-sts");
import STS = AWS_STS.STS;
import GetCallerIdentityCommandOutput = AWS_STS.GetCallerIdentityCommandOutput;
import GetCallerIdentityCommandInput = AWS_STS.GetCallerIdentityCommandInput;

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