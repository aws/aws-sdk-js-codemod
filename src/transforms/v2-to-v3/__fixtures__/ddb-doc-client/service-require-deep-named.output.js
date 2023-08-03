// Transformation of DocumentClient named import from deep path is unsupported in aws-sdk-js-codemod.
// Please convert to a default import, and re-run aws-sdk-js-codemod.
const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const documentClient = new DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();