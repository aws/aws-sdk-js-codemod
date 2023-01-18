import AWS from "aws-sdk";

export const listTables = async (client: AWS.DynamoDB) => client.listTables().promise();
export const listTagsOfResource = async (client: AWS.DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();

// Client as class member
class ClientClassMember {
  private clientInClass: AWS.DynamoDB;
  
  constructor(clientInCtr: AWS.DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return this.clientInClass.listTables().promise();
  }

  async listTagsOfResource() {
    return this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
  }
}