import { DynamoDB as DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();
const data = await client.listTables();