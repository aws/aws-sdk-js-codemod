import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

// Promise call on request in variable declarator
const listTablesRequest = client.listTables();
listTablesRequest
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

const listTagsOfResourceRequest = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
listTagsOfResourceRequest
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));
