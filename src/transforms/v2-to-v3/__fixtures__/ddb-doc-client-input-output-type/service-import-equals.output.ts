import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDBDocument
} = AWS_lib_dynamodb;

import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const {
  DynamoDB: DynDB
} = AWS_DynamoDB;

const docClient = DynamoDBDocument.from(new DynDB({ region: "us-west-2" }));

const docClientScanInput: AWS_DynDBDocumentClient.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_DynDBDocumentClient.ScanCommandOutput = await docClient
  .scan(docClientScanInput);