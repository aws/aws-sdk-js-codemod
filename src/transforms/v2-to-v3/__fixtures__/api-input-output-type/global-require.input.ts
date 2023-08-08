const AWS = require("aws-sdk");

const ddbClient = new AWS.DynamoDB({ region: "us-west-2" });
const listTablesInput: typeof AWS.DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: typeof AWS.DynamoDB.ListTablesOutput = await ddbClient
  .listTables(listTablesInput)
  .promise();

const stsClient = new AWS.STS({ region: "us-west-2" });
const getCallerIdentityInput: typeof AWS.STS.GetCallerIdentityRequest = {};
const getCallerIdentityOutput: typeof AWS.STS.GetCallerIdentityResponse = await stsClient
  .getCallerIdentity(getCallerIdentityInput)
  .promise();