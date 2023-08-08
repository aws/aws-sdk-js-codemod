const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });

const docClientScanInput: typeof AWS.DynamoDB.DocumentClient.ScanInput = {
  TableName: "TableName"
};

const docClientScanOutput: typeof AWS.DynamoDB.DocumentClient.ScanOutput = await docClient
  .scan(docClientScanInput)
  .promise();