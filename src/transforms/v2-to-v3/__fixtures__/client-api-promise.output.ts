import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

client
  .listTables()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));