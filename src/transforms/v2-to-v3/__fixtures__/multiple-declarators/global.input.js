const AWS = require("aws-sdk"),
  client = new AWS.DynamoDB();

const response = await client.listTables().promise();