import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// ExpressionStatement
client.listTables().promise();

// Client as class member
class ClientClassMember {
  constructor(clientInCtr = new AWS.DynamoDB()) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables().promise();
  }

  async listTagsOfResource() {
    return await this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
  }
}

// Variable declarator
const listTablesPromise = client.listTables().promise();
const listTagsOfResourcePromise = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();

// Promise call on request in variable declarator
const listTablesRequest = client.listTables();
listTablesRequest
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));

const listTagsOfResourceRequest = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
listTagsOfResourceRequest
  .promise()
  .then((data) => console.log(data))
  .catch((err) => console.log(err, err.stack));