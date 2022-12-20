import AWS from "aws-sdk";

export const listTables = (client: AWS.DynamoDB) => client.listTables().promise();