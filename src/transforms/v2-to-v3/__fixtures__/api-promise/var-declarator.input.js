import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// Variable declarator
const listTablesPromise = client.listTables().promise();
const listTagsOfResourcePromise = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
