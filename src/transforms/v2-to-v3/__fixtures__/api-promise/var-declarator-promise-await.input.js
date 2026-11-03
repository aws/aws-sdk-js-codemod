import AWS from "aws-sdk";

const client = new AWS.S3();

// Promise call on request in variable declarator, without chained calls
const listBucketsRequest = client.listBuckets();
await listBucketsRequest.promise();

const listObjectsRequest = client.listObjects({ Bucket: "BUCKET_NAME" });
const listObjectsResponse = await listObjectsRequest.promise();

const getObjectRequest = client.getObject({ Bucket: "BUCKET_NAME", Key: "KEY" });
const getObjectPromise = getObjectRequest.promise();

const getBucketsPromise = () => listBucketsRequest.promise();

function getObject() {
  return getObjectRequest.promise();
}
