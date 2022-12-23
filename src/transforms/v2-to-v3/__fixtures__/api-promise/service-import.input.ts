import DynamoDB from "aws-sdk/clients/dynamodb";

export const listTables = (client: DynamoDB) => client.listTables().promise();

// Client as class member
class ClientClassMember {
  private client: DynamoDB;
  
  constructor(client: DynamoDB) {
    this.client = client;
  }

  async listTables() {
    return await this.client.listTables().promise();
  }
}