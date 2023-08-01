import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDBDocument
} = AWS_lib_dynamodb;

import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const {
  DynamoDB
} = AWS_DynamoDB;

const docClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));

const docClientScanInput: AWS_DynamoDBDocumentClient.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_DynamoDBDocumentClient.ScanCommandOutput = await docClient
  .scan(docClientScanInput);