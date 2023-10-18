import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
import DynamoDBDocument = AWS_lib_dynamodb.DynamoDBDocument;
import ScanCommandOutput = AWS_lib_dynamodb.ScanCommandOutput;
import ScanCommandInput = AWS_lib_dynamodb.ScanCommandInput;
import AWS_client_dynamodb = require("@aws-sdk/client-dynamodb");
import DynDB = AWS_client_dynamodb.DynamoDB;

const docClient = DynamoDBDocument.from(new DynDB({ region: "us-west-2" }));

const docClientScanInput: ScanCommandInput = {
  TableName: "TableName"
};

const docClientScanOutput: ScanCommandOutput = await docClient
  .scan(docClientScanInput);