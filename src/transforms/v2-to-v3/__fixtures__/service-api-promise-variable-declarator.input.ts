import DynamoDB from "aws-sdk/clients/dynamodb";

const client = new DynamoDB();
const listTablesPromise = client.listTables().promise();