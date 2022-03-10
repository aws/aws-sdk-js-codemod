import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();
const listTablesPromise = client.listTables();