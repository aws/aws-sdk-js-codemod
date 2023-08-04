import * as AWS_DynamoDBDocumentClient from "@aws-sdk/lib-dynamodb";

const {
  DynamoDBDocument
} = AWS_DynamoDBDocumentClient;

import { DynamoDB } from "@aws-sdk/client-dynamodb";

const docClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));

const docClientScanInput: AWS_DynamoDBDocumentClient.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_DynamoDBDocumentClient.ScanCommandOutput = await docClient
  .scan(docClientScanInput);