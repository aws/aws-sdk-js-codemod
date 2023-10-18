import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
import DynamoDBDocument = AWS_lib_dynamodb.DynamoDBDocument;
import AWS_client_dynamodb = require("@aws-sdk/client-dynamodb");
import DynamoDB = AWS_client_dynamodb.DynamoDB;

const documentClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));
const response = await documentClient.scan({ TableName: "TABLE_NAME" });