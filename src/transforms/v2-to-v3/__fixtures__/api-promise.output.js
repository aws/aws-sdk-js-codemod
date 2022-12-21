import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

// Promise without params
{
  // .then() and .catch()
  client
    .listTables()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}

// Promise with params
{
  // .then() and .catch()
  client
    .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}