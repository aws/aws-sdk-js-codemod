import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTables = async (client: DynamoDB) => client.listTables();
export const listTagsOfResource = async (client: DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });