const {
  DynamoDB,
  DynamoDB: DynDB
} = require("@aws-sdk/client-dynamodb");

const client1 = new DynDB();
const client2 = new DynamoDB();