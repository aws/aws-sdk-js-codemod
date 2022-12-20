import DynamoDB from "aws-sdk/clients/dynamodb";

const client = new DynamoDB();

client
  .listTables()
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));