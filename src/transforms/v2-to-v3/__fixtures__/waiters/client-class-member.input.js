import AWS from "aws-sdk";

// Client as class member
class ClientClassMember {
  constructor(clientInCtr = new AWS.S3()) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return this.clientInClass.waitFor("bucketExists", { Bucket }).promise();
  }
}