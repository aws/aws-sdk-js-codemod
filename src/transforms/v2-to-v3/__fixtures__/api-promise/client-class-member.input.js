import AWS from "aws-sdk";

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

// Client as class member with creation inside constructor
class ClientClassMemberConstructor {
  constructor() {
    this.clientInClassCtr = new AWS.DynamoDB();
  }

  async listTables() {
    return this.clientInClassCtr.listTables().promise();
  }

  async listTagsOfResource() {
    return this.clientInClassCtr.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
  }
}