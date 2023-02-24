import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// async/await
try {
  await client.listTables().promise();
  await client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
} catch (err) {
  console.log(err, err.stack);
}