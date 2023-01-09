const debug = require("debug")("http");
import AWS from "aws-sdk";

const client = new AWS.DynamoDB();