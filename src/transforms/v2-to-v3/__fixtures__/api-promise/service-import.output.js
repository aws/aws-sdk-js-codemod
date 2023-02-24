import { DynamoDB as DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();

// ExpressionStatement
client.listTables();