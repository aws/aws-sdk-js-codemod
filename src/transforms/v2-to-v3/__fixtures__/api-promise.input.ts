import AWS from "aws-sdk";

const region = "us-west-2";
const client = new AWS.DynamoDB({ region });

client
  .listTables({})
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

