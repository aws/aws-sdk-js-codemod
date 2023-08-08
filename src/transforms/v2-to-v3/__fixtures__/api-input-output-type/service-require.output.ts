const AWS_DynamoDB = require("@aws-sdk/client-dynamodb"),
      {
        DynamoDB
      } = AWS_DynamoDB;
const AWS_STS = require("@aws-sdk/client-sts"),
      {
        STS
      } = AWS_STS;

const ddbClient = new DynamoDB({ region: "us-west-2" });
const listTablesInput: typeof AWS_DynamoDB.ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: typeof AWS_DynamoDB.ListTablesCommandOutput = await ddbClient
  .listTables(listTablesInput);

const stsClient = new STS({ region: "us-west-2" });
const getCallerIdentityInput: typeof AWS_STS.GetCallerIdentityCommandInput = {};
const getCallerIdentityOutput: typeof AWS_STS.GetCallerIdentityCommandOutput = await stsClient
  .getCallerIdentity(getCallerIdentityInput);