import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTables = (client: DynamoDB) => client.listTables();