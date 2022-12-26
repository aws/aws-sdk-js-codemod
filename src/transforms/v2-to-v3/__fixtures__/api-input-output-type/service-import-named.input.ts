import DynamoDB, { ListTablesInput, ListTablesOutput } from "aws-sdk/clients/dynamodb";

const client = new DynamoDB({ region: "us-west-2" });

const listTablesInput: ListTablesInput = { Limit: 10 };
const listTablesOutput: ListTablesOutput = await client
  .listTables(listTablesInput)
  .promise();
