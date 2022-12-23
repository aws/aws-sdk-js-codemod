import AWS from "aws-sdk";

export const listTables = (client: AWS.DynamoDB) => client.listTables().promise();

// Client as class member
class ClientClassMember {
  private client: AWS.DynamoDB;
  
  constructor(client: AWS.DynamoDB) {
    this.client = client;
  }

  async listTables() {
    return await this.client.listTables().promise();
  }
}