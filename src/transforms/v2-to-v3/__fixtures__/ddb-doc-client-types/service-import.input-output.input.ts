import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient({ region: "us-west-2" });

const docClientScanInput: DynamoDB.DocumentClient.ScanInput = {
  TableName: "TableName"
};

const docClientScanOutput: DynamoDB.DocumentClient.ScanOutput = await docClient
  .scan(docClientScanInput)
  .promise();