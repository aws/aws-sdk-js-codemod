import { S3, waitUntilBucketExists } from "@aws-sdk/client-s3";

// Client as class member
class ClientClassMember {
  constructor(clientInCtr = new S3()) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return waitUntilBucketExists({
      client: this.clientInClass,
      maxWaitTime: 200
    }, { Bucket: "BUCKET" });
  }
}