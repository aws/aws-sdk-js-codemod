import DynamoDB from "aws-sdk/clients/dynamodb";

export const listTablesObjectProperty = async (client: DynamoDB) => ({
  promise: client.listTables().promise(),
});

export const listTables = async (client: DynamoDB) => client.listTables().promise();
export const listTagsOfResource = async (client: DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();