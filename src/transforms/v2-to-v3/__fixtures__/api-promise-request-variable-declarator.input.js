import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

const listTablesRequest = client.listTables();
listTablesRequest
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));