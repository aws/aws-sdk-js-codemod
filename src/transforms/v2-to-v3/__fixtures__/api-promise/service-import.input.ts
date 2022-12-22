import DynamoDB from "aws-sdk/clients/dynamodb";

export const listTables = (client: DynamoDB) => client.listTables().promise();