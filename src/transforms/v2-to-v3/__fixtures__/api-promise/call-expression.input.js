import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

const promiseArray = [];
promiseArray.push(client.listTables().promise());