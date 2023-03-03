const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();