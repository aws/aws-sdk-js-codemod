import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();
try {
  const data = await client.listTables();
  console.log(data);
} catch (err) {
  console.log(err, err.stack);
}