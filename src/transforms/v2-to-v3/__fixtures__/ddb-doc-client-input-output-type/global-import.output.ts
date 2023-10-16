import { DynamoDBDocument, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const docClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));

const docClientScanInput: ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: ScanCommandOutput = await docClient
  .scan(docClientScanInput);