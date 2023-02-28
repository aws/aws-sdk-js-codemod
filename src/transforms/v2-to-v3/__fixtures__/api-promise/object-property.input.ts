import AWS from "aws-sdk";

export const listTablesObjectProperty = async (client: AWS.DynamoDB) => ({
  promise: client.listTables().promise(),
});