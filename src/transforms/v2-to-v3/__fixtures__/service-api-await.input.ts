import DynamoDB from "aws-sdk/clients/dynamodb";

const client = new DynamoDB();
const data = await client.listTables().promise();