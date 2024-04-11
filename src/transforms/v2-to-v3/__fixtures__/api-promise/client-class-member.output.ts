import { DynamoDB } from "@aws-sdk/client-dynamodb";

// Client as class member
class ClientClassMember {
  private clientInClass: DynamoDB;
  
  constructor(clientInCtr: DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return this.clientInClass.listTables();
  }

  async listTagsOfResource() {
    return this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
  }
}

// Client as class member with creation inside constructor
class ClientClassMemberConstructor {
  private clientInClassCtr: DynamoDB;
  
  constructor() {
    this.clientInClassCtr = new DynamoDB();
  }

  async listTables() {
    return this.clientInClassCtr.listTables();
  }

  async listTagsOfResource() {
    return this.clientInClassCtr.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
  }
}