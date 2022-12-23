import AWS from "aws-sdk";

const client = new AWS.DynamoDB({ region: "us-west-2" });

const listTablesInput: AWS.DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: AWS.DynamoDB.ListTablesOutput = await client
  .listTables(listTablesInput)
  .promise();

