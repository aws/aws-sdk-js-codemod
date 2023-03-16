const DocumentClient = require("aws-sdk/clients/dynamodb").DocumentClient;

const documentClient = new DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();