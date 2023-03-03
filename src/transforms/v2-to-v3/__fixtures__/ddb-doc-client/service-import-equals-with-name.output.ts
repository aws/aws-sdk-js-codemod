import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDBDocument
} = AWS_lib_dynamodb;

import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const {
  DynamoDB: DynamoDBClient
} = AWS_DynamoDB;

const documentClient = DynamoDBDocument.from(new DynamoDBClient({ region: "us-west-2" }));
const response = await documentClient.scan({ TableName: "TABLE_NAME" });