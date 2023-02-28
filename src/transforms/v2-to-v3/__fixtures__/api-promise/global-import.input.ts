import AWS from "aws-sdk";

export const listTablesObjectProperty = async (client: AWS.DynamoDB) => ({
  promise: client.listTables().promise(),
});

export const listTables = async (client: AWS.DynamoDB) => client.listTables().promise();
export const listTagsOfResource = async (client: AWS.DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();