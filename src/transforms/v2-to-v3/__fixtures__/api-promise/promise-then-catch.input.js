import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// .then() and .catch()
client
  .listTables()
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

client
  .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));