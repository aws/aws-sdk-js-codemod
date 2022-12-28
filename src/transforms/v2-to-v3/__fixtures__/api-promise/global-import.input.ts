import AWS from "aws-sdk";

export const listTables = (client: AWS.DynamoDB) => client.listTables().promise();

// Client as class member
class ClientClassMember {
  private clientInClass: AWS.DynamoDB;
  
  constructor(clientInCtr: AWS.DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables().promise();
  }
}