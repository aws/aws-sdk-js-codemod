import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTablesObjectProperty = async (client: DynamoDB) => ({
  promise: client.listTables(),
});

export const listTables = async (client: DynamoDB) => client.listTables();
export const listTagsOfResource = async (client: DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });