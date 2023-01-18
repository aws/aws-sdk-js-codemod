import DynamoDB from "aws-sdk/clients/dynamodb";

export const listTables = (client: DynamoDB) => client.listTables().promise();
export const listTagsOfResource = (client: DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();

// Client as class member
class ClientClassMember {
  private clientInClass: DynamoDB;
  
  constructor(clientInCtr: DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables().promise();
  }
}