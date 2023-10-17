import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
import DynamoDBDocument = AWS_lib_dynamodb.DynamoDBDocument;
import ScanCommandOutput = AWS_lib_dynamodb.ScanCommandOutput;
import ScanCommandInput = AWS_lib_dynamodb.ScanCommandInput;
import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");
import DynamoDB = AWS_DynamoDB.DynamoDB;

const docClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));

const docClientScanInput: ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: ScanCommandOutput = await docClient
  .scan(docClientScanInput);