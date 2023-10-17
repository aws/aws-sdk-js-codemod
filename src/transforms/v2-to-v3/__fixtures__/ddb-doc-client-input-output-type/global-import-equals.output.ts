import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const docClient = AWS_lib_dynamodb.DynamoDBDocument.from(new AWS_DynamoDB.DynamoDB({ region: "us-west-2" }));

const docClientScanInput: AWS_lib_dynamodb.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_lib_dynamodb.ScanCommandOutput = await docClient
  .scan(docClientScanInput);