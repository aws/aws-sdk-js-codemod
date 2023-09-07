import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

const promiseArray = [];
promiseArray.push(client.listTables());