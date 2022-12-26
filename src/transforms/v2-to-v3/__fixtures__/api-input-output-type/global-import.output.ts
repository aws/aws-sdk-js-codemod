import { DynamoDB, ListTablesCommandInput, ListTablesCommandOutput } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({ region: "us-west-2" });

const listTablesInput: ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: ListTablesCommandOutput = await client
  .listTables(listTablesInput);