import AWS from "aws-sdk";

// Client as class member
class ClientClassMember {
  private clientInClass: AWS.S3;

  constructor(clientInCtr: AWS.S3) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return this.clientInClass.waitFor("bucketExists", { Bucket: "BUCKET" }).promise();
  }
}