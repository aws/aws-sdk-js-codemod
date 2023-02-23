import { S3, waitUntilBucketExists, waitUntilBucketNotExists } from "@aws-sdk/client-s3";

const Bucket = "BUCKET_NAME";
const client = new S3({ region: "REGION" });

await waitUntilBucketNotExists({
  client,
  maxWaitTime: 200
}, { Bucket });
await client.createBucket({ Bucket });
await waitUntilBucketExists({
  client,
  maxWaitTime: 200
}, { Bucket });

// Waiter configuration: delay
await waitUntilBucketExists({
  client,
  minDelay: 2,
  maxWaitTime: 40
}, {
  Bucket
});

// Waiter configuration: maxAttempts
await waitUntilBucketExists({
  client,
  maxWaitTime: 100
}, {
  Bucket
});

// Waiter configuration: delay+maxAttempts
await waitUntilBucketExists({
  client,
  minDelay: 2,
  maxWaitTime: 20
}, {
  Bucket
});

// Client as class member
class ClientClassMember {
  constructor(clientInCtr = new S3()) {
    this.clientInClass = clientInCtr;
  }

  async listTables() {
    return await waitUntilBucketExists({
      client: this.clientInClass,
      maxWaitTime: 200
    }, { Bucket });
  }
}