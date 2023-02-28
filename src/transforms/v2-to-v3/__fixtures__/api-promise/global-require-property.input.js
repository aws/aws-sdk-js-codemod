const DynamoDB = require("aws-sdk").DynamoDB;

const client = new DynamoDB();
const data = await client.listTables().promise();