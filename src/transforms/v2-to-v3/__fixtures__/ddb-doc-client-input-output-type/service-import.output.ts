import * as AWS_DynDBDocumentClient from "@aws-sdk/lib-dynamodb";

const {
  DynamoDBDocument
} = AWS_DynDBDocumentClient;

import { DynamoDB as DynDB } from "@aws-sdk/client-dynamodb";

const docClient = DynamoDBDocument.from(new DynDB({ region: "us-west-2" }));

const docClientScanInput: AWS_DynDBDocumentClient.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_DynDBDocumentClient.ScanCommandOutput = await docClient
  .scan(docClientScanInput);