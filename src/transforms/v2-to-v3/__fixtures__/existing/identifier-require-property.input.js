const DynDB = require("aws-sdk").DynamoDB;
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const client1 = new DynDB();
const client2 = new DynamoDB();