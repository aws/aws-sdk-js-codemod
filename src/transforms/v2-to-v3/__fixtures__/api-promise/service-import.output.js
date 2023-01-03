import { DynamoDB as DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();

// Promise without params
{
  // async/await
  try {
    await client.listTables();
    console.log(data);
  } catch (err) {
    console.log(err, err.stack);
  }

  // .then() and .catch()
  client
    .listTables()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));

  // Client as class member
  class ClientClassMember {
    constructor(clientInCtr = new DynamoDBClient()) {
      this.clientInClass = clientInCtr;
    }
  
    async listTables() {
      return await this.clientInClass.listTables();
    }
  }

  // Variable declarator
  const listTablesPromise = client.listTables();

  // Promise call on request in variable declarator
  const listTablesRequest = client.listTables();
  listTablesRequest
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}

// Promise with params
{
  // async/await
  try {
    await client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
    console.log(data);
  } catch (err) {
    console.log(err, err.stack);
  }

  // .then() and .catch()
  client
    .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}