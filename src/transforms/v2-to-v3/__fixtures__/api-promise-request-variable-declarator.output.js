import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

const listTablesRequest = client.listTables();
listTablesRequest
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));