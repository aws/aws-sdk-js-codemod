import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTables = (client: DynamoDB) => client.listTables();

// Client as class member
class ClientClassMember {
  private clientInClass: DynamoDB;
  
  constructor(clientInCtr: DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables();
  }
}