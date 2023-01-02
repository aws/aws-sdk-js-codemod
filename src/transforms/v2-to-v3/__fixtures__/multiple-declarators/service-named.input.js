const { DynamoDB } = require("aws-sdk"),
  client = new DynamoDB();

const response = await client.listTables().promise();