const DynamoDBClient = require("aws-sdk/clients/dynamodb");

const client = new DynamoDBClient();

// ExpressionStatement
client.listTables().promise();