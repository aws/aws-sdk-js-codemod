import AWS_DynamoDB from "@aws-sdk/client-dynamodb";

const TableName: string = "TABLE_NAME";
const AttributesToGet: string[] = ["ATTRIBUTE_NAME"];
const Limit: number = 10;
const Select = AWS_DynamoDB.Select.ALL_ATTRIBUTES;
const ScanFilter: Record<string, AWS_DynamoDB.Condition> = {
  Genre: {
    AttributeValueList: [{ S: "Rock" }],
    ComparisonOperator: "EQ",
  },
};
const ConditionalOperator = AWS_DynamoDB.ConditionalOperator.AND;
const ExclusiveStartKey: Record<string, AWS_DynamoDB.AttributeValue> = {
  PARTITION_KEY: { S: "PARTITION_KEY" },
  SORT_KEY: { S: "SORT_KEY" },
};
const ConsistentRead: boolean = true;

const scanInput: AWS_DynamoDB.ScanCommandInput = {
  TableName,
  AttributesToGet,
  Limit,
  Select,
  ScanFilter,
  ConditionalOperator,
  ExclusiveStartKey,
  ConsistentRead,
};
