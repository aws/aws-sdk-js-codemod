const {
  DynamoDB,
  ListTablesCommandInput,
  ListTablesCommandOutput
} = require("@aws-sdk/client-dynamodb");
const {
  STS,
  GetCallerIdentityCommandInput,
  GetCallerIdentityCommandOutput
} = require("@aws-sdk/client-sts");

const ddbClient = new DynamoDB({ region: "us-west-2" });
const listTablesInput: ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: ListTablesCommandOutput = await ddbClient
  .listTables(listTablesInput);

const stsClient = new STS({ region: "us-west-2" });
const getCallerIdentityInput: GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: GetCallerIdentityCommandOutput = await stsClient
  .getCallerIdentity(getCallerIdentityInput);