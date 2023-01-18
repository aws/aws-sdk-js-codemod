import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTables = async (client: DynamoDB) => client.listTables();
export const listTagsOfResource = async (client: DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });

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