import DynamoDBClient from "aws-sdk/clients/dynamodb";

const client = new DynamoDBClient();
const data = await client.listTables().promise();