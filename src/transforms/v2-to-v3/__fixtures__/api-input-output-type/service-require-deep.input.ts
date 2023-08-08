const DynamoDB = require("aws-sdk/clients/dynamodb");
const STS = require("aws-sdk/clients/sts");

const ddbClient = new DynamoDB({ region: "us-west-2" });
const listTablesInput: typeof DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: typeof DynamoDB.ListTablesOutput = await ddbClient
  .listTables(listTablesInput)
  .promise();

const stsClient = new STS({ region: "us-west-2" });
const getCallerIdentityInput: typeof STS.GetCallerIdentityRequest = {};
const getCallerIdentityOutput: typeof STS.GetCallerIdentityResponse = await stsClient
  .getCallerIdentity(getCallerIdentityInput)
  .promise();