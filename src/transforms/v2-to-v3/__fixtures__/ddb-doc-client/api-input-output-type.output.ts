import AWS_DynamoDBDocument, { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const docClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));

const docClientScanInput: AWS_DynamoDBDocument.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_DynamoDBDocument.ScanCommandOutput = await docClient
  .scan(docClientScanInput);