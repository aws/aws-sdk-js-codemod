import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// Promise call on request in variable declarator
const listTablesRequest = client.listTables();
listTablesRequest
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

const listTagsOfResourceRequest = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
listTagsOfResourceRequest
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));
