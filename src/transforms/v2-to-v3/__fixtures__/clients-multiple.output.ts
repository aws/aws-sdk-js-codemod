import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";

const region = "us-west-2";

const dynamodbClient = new DynamoDB({ region });
const s3Client = new S3({ region });