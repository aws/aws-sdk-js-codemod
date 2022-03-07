import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

const listTablesPromise = client.listTables().promise();
listTablesPromise.then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

