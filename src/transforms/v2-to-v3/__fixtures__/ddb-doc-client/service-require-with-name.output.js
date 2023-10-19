const {
  DynamoDBDocument
} = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDB: DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const documentClient = DynamoDBDocument.from(new DynamoDBClient({ region: "us-west-2" }));
const response = await documentClient.scan({ TableName: "TABLE_NAME" });