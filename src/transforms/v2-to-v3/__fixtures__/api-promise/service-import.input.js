import { DynamoDB } from "aws-sdk";

const client = new DynamoDB();
const data = await client.listTables().promise();