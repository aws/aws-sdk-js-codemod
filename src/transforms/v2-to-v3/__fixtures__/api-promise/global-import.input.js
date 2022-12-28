import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// Promise without params
{
  // async/await
  try {
    await client.listTables().promise();
    console.log(data);
  } catch (err) {
    console.log(err, err.stack);
  }

  // .then() and .catch()
  client
    .listTables()
    .promise()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));

  // Client as class member
  class ClientClassMember {
    constructor(clientInCtr = new AWS.DynamoDB()) {
      this.clientInClass = clientInCtr;
    }
  
    async listTables() {
      return await this.clientInClass.listTables().promise();
    }
  }

  // Variable declarator
  const listTablesPromise = client.listTables().promise();

  // Promise call on request in variable declarator
  const listTablesRequest = client.listTables();
  listTablesRequest
    .promise()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}

// Promise with params
{
  // async/await
  try {
    await client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
    console.log(data);
  } catch (err) {
    console.log(err, err.stack);
  }

  // .then() and .catch()
  client
    .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
    .promise()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}