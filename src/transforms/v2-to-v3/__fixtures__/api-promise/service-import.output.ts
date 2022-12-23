import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const listTables = (client: DynamoDB) => client.listTables();

// Client as class member
class ClientClassMember {
  private client: DynamoDB;
  
  constructor(client: DynamoDB) {
    this.client = client;
  }

  async listTables() {
    return await this.client.listTables();
  }
}