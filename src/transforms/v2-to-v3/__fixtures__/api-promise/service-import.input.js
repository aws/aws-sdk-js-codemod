import DynamoDBClient from "aws-sdk/clients/dynamodb";

const client = new DynamoDBClient();

// ExpressionStatement
client.listTables().promise();