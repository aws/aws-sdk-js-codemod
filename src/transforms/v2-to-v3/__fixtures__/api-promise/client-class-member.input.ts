import AWS from "aws-sdk";

// Client as class member
class ClientClassMember {
  private clientInClass: AWS.DynamoDB;
  
  constructor(clientInCtr: AWS.DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return this.clientInClass.listTables().promise();
  }

  async listTagsOfResource() {
    return this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
  }
}

// Client as class member with creation inside constructor
class ClientClassMemberConstructor {
  private clientInClassCtr: AWS.DynamoDB;
  
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