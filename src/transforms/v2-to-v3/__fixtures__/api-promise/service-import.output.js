import { DynamoDB as DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();

// ExpressionStatement
client.listTables();

// Variable declarator
const listTablesPromise = client.listTables();
const listTagsOfResourcePromise = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });

// Promise call on request in variable declarator
const listTablesRequest = client.listTables();
listTablesRequest
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

const listTagsOfResourceRequest = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
listTagsOfResourceRequest
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));