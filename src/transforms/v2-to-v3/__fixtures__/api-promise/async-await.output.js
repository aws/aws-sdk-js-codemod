import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

// async/await
try {
  await client.listTables();
  await client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
} catch (err) {
  console.log(err, err.stack);
}