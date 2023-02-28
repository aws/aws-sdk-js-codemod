import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTablesObjectProperty = async (client: DynamoDB) => ({
  promise: client.listTables(),
});