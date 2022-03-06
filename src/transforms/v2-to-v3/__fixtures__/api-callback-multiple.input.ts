import AWS from "aws-sdk";

const region = "us-west-2";
const client = new AWS.DynamoDB({ region });

client.listTables({}, (err, data) => {
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
