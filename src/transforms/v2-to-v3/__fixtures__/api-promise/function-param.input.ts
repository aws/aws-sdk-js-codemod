import AWS from "aws-sdk";

export const listTables = async (client: AWS.DynamoDB) => client.listTables().promise();
export const listTagsOfResource = async (client: AWS.DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();