const DynamoDB = require("aws-sdk/clients/dynamodb");

const client = new DynamoDB({ region: "us-west-2" });

const listTablesInput: DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: DynamoDB.ListTablesOutput = await client
  .listTables(listTablesInput)
  .promise();
