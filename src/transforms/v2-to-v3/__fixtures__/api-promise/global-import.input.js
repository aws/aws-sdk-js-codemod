import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// ExpressionStatement
client.listTables().promise();