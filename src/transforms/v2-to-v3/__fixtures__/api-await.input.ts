import AWS from "aws-sdk";

const client = new AWS.DynamoDB();
try {
  const data = await client.listTables().promise();
  console.log(data);
} catch (err) {
  console.log(err, err.stack);
}