import { DynamoDB } from "@aws-sdk/client-dynamodb";

const region = "us-west-2";
const client = new DynamoDB({ region });

client
  .listTables({})
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

