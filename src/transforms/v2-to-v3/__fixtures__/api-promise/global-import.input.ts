import AWS from "aws-sdk";

export const listTables = (client: AWS.DynamoDB) => client.listTables().promise();
export const listTagsOfResource = (client: AWS.DynamoDB) =>
  client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();

// Client as class member
class ClientClassMember {
  private clientInClass: AWS.DynamoDB;
  
  constructor(clientInCtr: AWS.DynamoDB) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables().promise();
  }

  async listTagsOfResource() {
    return await this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
  }
}