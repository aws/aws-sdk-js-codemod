import { describe, it } from "node:test";
import assert from "node:assert";
import { filterClientsByOption } from "./filterClientsByOption";

describe("filterClientsByOption", () => {
  const mockClientNamesRecord = {
    S3: "S3",
    DynamoDB: "DynamoDB", 
    Lambda: "Lambda",
    EC2: "EC2",
    RDS: "RDS"
  };

  it("should return all clients when no option is provided", () => {
    const result = filterClientsByOption(mockClientNamesRecord);
    assert.deepStrictEqual(result, mockClientNamesRecord);
  });

  it("should return all clients when empty string is provided", () => {
    const result = filterClientsByOption(mockClientNamesRecord, "");
    assert.deepStrictEqual(result, mockClientNamesRecord);
  });

  it("should filter to single client (case insensitive)", () => {
    const result = filterClientsByOption(mockClientNamesRecord, "s3");
    assert.deepStrictEqual(result, { S3: "S3" });
  });

  it("should filter to multiple clients", () => {
    const result = filterClientsByOption(mockClientNamesRecord, "s3,dynamodb");
    assert.deepStrictEqual(result, { 
      S3: "S3",
      DynamoDB: "DynamoDB"
    });
  });

  it("should handle whitespace in client list", () => {
    const result = filterClientsByOption(mockClientNamesRecord, " s3 , dynamodb , lambda ");
    assert.deepStrictEqual(result, { 
      S3: "S3",
      DynamoDB: "DynamoDB",
      Lambda: "Lambda"
    });
  });

  it("should return empty object for non-existent clients", () => {
    const result = filterClientsByOption(mockClientNamesRecord, "nonexistent,alsononexistent");
    assert.deepStrictEqual(result, {});
  });

  it("should filter mixed existing and non-existing clients", () => {
    const result = filterClientsByOption(mockClientNamesRecord, "s3,nonexistent,lambda");
    assert.deepStrictEqual(result, { 
      S3: "S3",
      Lambda: "Lambda"
    });
  });

  it("should handle empty entries in comma-separated list", () => {
    const result = filterClientsByOption(mockClientNamesRecord, "s3,,dynamodb,");
    assert.deepStrictEqual(result, { 
      S3: "S3",
      DynamoDB: "DynamoDB"
    });
  });
});
