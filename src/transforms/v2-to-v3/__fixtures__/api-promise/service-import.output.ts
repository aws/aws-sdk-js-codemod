import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTables = (client: DynamoDB) => client.listTables();
export const listTagsOfResource = (client: DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });

// Client as class member
class ClientClassMember {
  private clientInClass: DynamoDB;
  
  constructor(clientInCtr: DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables();
  }

  async listTagsOfResource() {
    return await this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
  }
}