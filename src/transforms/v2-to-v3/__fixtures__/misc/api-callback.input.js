import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

client.listTables((err, data) => {
  if (err) console.log(err, err.stack);
  else console.log(data);
});

client.listTagsOfResource(
  { ResourceArn: "STRING_VALUE" },
  (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  }
);
