import { S3 } from "@aws-sdk/client-s3";

const client = new S3();

// Promise call on request in variable declarator, without chained calls
const listBucketsRequest = client.listBuckets();
await listBucketsRequest;

const listObjectsRequest = client.listObjects({ Bucket: "BUCKET_NAME" });
const listObjectsResponse = await listObjectsRequest;

const getObjectRequest = client.getObject({ Bucket: "BUCKET_NAME", Key: "KEY" });
const getObjectPromise = getObjectRequest;

const getBucketsPromise = () => listBucketsRequest;

function getObject() {
  return getObjectRequest;
}
