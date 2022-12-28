import AWS from "aws-sdk";

const TableName: AWS.DynamoDB.TableName = "TABLE_NAME";
const AttributesToGet: AWS.DynamoDB.AttributeNameList = ["ATTRIBUTE_NAME"];
const Limit: AWS.DynamoDB.PositiveIntegerObject = 10;
const Select: AWS.DynamoDB.Select = "ALL_ATTRIBUTES";
const ScanFilter: AWS.DynamoDB.FilterConditionMap = {
  Genre: {
    AttributeValueList: [{ S: "Rock" }],
    ComparisonOperator: "EQ",
  },
};
const ConditionalOperator: AWS.DynamoDB.ConditionalOperator = "AND";
const ExclusiveStartKey: AWS.DynamoDB.Key = {
  PARTITION_KEY: { S: "PARTITION_KEY" },
  SORT_KEY: { S: "SORT_KEY" },
};
const ConsistentRead: AWS.DynamoDB.ConsistentRead = true;

const scanInput: AWS.DynamoDB.ScanInput = {
  TableName,
  AttributesToGet,
  Limit,
  Select,
  ScanFilter,
  ConditionalOperator,
  ExclusiveStartKey,
  ConsistentRead,
};
