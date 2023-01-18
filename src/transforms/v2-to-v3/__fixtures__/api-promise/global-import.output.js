import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

// async/await
try {
  await client.listTables();
  await client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
  console.log(data);
} catch (err) {
  console.log(err, err.stack);
}

// .then() and .catch()
client
  .listTables()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));
client
  .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

// Client as class member
class ClientClassMember {
  constructor(clientInCtr = new DynamoDB()) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables();
  }

  async listTagsOfResource() {
    return await this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
  }
}

// Variable declarator
const listTablesPromise = client.listTables();
const listTagsOfResourcePromise = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });

// Promise call on request in variable declarator
const listTablesRequest = client.listTables();
listTablesRequest
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

const listTagsOfResourceRequest = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
listTagsOfResourceRequest
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));