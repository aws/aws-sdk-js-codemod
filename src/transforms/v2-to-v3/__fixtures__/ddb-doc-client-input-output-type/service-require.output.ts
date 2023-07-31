const {
        DynamoDBDocument
      } = require("@aws-sdk/lib-dynamodb"),
      AWS_DynDBDocumentClient = require("@aws-sdk/lib-dynamodb"),
      {
        DynamoDB: DynDB
      } = require("@aws-sdk/client-dynamodb");

const docClient = DynamoDBDocument.from(new DynDB({ region: "us-west-2" }));

const docClientScanInput: AWS_DynDBDocumentClient.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_DynDBDocumentClient.ScanCommandOutput = await docClient
  .scan(docClientScanInput);