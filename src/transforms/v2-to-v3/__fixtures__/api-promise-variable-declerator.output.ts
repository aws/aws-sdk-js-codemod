import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

const listTablesPromise = client.listTables();
listTablesPromise
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));
