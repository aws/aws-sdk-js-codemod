import AWS from "aws-sdk";

// Client as class member
class ClientClassMember {
  constructor(clientInCtr = new AWS.DynamoDB()) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await this.clientInClass.listTables().promise();
  }

  async listTagsOfResource() {
    return await this.clientInClass.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
  }
}