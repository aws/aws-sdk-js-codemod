import AWS from "aws-sdk";

const documentClient = new AWS.DynamoDB.DocumentClient({
  wrapNumbers: true,
});