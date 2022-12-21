import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

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
    constructor(client = new DynamoDB()) {
      this.client = client;
    }
  
    async listTables() {
      return await this.client.listTables();
    }
  }
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