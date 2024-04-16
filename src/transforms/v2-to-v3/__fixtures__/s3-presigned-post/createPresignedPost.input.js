import AWS from "aws-sdk";

const client = new AWS.S3();
const response = client.createPresignedPost(params);