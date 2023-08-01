const AWS_DynamoDBDocumentClient = require("@aws-sdk/lib-dynamodb"),
      {
        DynamoDBDocument
      } = AWS_DynamoDBDocumentClient,
      {
        DynamoDB
      } = require("@aws-sdk/client-dynamodb");

const docClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));

const docClientScanInput: AWS_DynamoDBDocumentClient.ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: AWS_DynamoDBDocumentClient.ScanCommandOutput = await docClient
  .scan(docClientScanInput);