import DynamoDB from "aws-sdk/clients/dynamodb";

export const listTables = async (client: DynamoDB) => client.listTables().promise();
export const listTagsOfResource = async (client: DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();

// Client as class member
class ClientClassMember {
  private clientInClass: DynamoDB;
  
  constructor(clientInCtr: DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return this.clientInClass.listTables().promise();
  }

  async listTagsOfResource() {
    return this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
  }
}