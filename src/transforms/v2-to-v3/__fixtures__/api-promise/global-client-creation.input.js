import AWS from "aws-sdk";

const data = await new AWS.DynamoDB().listTables().promise();