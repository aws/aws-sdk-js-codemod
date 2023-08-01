import AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });

const docClientScanInput: AWS.DynamoDB.DocumentClient.ScanInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS.DynamoDB.DocumentClient.ScanOutput = await docClient
  .scan(docClientScanInput)
  .promise();