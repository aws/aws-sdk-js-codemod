const debug = require("debug")("http");
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();