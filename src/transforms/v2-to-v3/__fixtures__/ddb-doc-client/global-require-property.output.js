// This code will change once DynamoDB Document Client transform is supported.
const DynamoDB = require("aws-sdk").DynamoDB;

const documentClient = new DynamoDB.DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();