import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const documentClient = AWS_lib_dynamodb.DynamoDBDocument.from(new AWS_DynamoDB.DynamoDB({ region: "us-west-2" }));
const response = await documentClient.scan({ TableName: "TABLE_NAME" });