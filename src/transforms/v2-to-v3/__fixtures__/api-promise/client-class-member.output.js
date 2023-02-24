import { DynamoDB } from "@aws-sdk/client-dynamodb";

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