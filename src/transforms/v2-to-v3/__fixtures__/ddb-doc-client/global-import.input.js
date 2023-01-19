// This code will change once DynamoDB Document Client transform is supported.
import AWS from "aws-sdk";

const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();