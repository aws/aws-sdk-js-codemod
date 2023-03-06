import AWS_DynamoDBDocument, { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const docClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));

const docClientGetInput: AWS_DynamoDBDocument.GetCommandInput = {
  TableName: "TableName",
  Key: { key: "value" }
};

const docClientGetOutput: AWS_DynamoDBDocument.GetCommandInput = await docClient
  .get(docClientGetInput);