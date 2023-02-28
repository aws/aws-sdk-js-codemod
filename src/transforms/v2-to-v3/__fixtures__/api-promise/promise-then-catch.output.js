import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

// .then() and .catch()
client
  .listTables()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

client
  .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));