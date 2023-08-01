import DynDB from "aws-sdk/clients/dynamodb";

const docClient = new DynDB.DocumentClient({ region: "us-west-2" });

const docClientScanInput: DynDB.DocumentClient.ScanInput = {
  TableName: "TableName"
};

const docClientScanOutput: DynDB.DocumentClient.ScanOutput = await docClient
  .scan(docClientScanInput)
  .promise();