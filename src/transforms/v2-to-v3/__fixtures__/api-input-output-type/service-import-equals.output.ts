import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const {
  DynamoDB
} = AWS_DynamoDB;

import AWS_STS = require("@aws-sdk/client-sts");

const {
  STS
} = AWS_STS;

const ddbClient = new DynamoDB({ region: "us-west-2" });
const listTablesInput: AWS_DynamoDB.ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: AWS_DynamoDB.ListTablesCommandOutput = await ddbClient
  .listTables(listTablesInput);

const stsClient = new STS({ region: "us-west-2" });
const getCallerIdentityInput: AWS_STS.GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: AWS_STS.GetCallerIdentityCommandOutput = await stsClient
  .getCallerIdentity(getCallerIdentityInput);