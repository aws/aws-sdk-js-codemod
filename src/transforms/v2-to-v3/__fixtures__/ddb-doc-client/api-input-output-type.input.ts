import AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });

const docClientGetInput: AWS.DynamoDB.DocumentClient.GetItemInput = {
  TableName: "TableName",
  Key: { key: "value" }
};

const docClientGetOutput: AWS.DynamoDB.DocumentClient.GetItemOutput = await docClient
  .get(docClientGetInput)
  .promise();