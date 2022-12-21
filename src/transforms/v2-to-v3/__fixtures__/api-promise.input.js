import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// Promise without params
{
  // .then() and .catch()
  client
    .listTables()
    .promise()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}

// Promise with params
{
  // .then() and .catch()
  client
    .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
    .promise()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}