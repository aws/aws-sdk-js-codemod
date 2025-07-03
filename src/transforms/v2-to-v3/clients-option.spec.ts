import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import jscodeshift from "jscodeshift";
import transformer from "./transformer";

describe("clients option", () => {
  const inputPath = join(__dirname, "__fixtures__", "clients-option", "input.js");
  const inputSource = readFileSync(inputPath, "utf8");

  const mockApi = {
    j: jscodeshift,
    jscodeshift,
    stats: () => {},
    report: () => {},
  };

  it("should transform only S3 client when --clients s3 is specified", async () => {
    const expectedPath = join(__dirname, "__fixtures__", "clients-option", "output-s3-only.js");
    const expectedSource = readFileSync(expectedPath, "utf8");

    const result = await transformer(
      { source: inputSource, path: inputPath },
      mockApi,
      { clients: "s3" }
    );

    // Remove comments for comparison since they can vary
    const normalizeSource = (source: string) => 
      source.replace(/\/\/ The `\.promise\(\)` call.*?\n/g, "").trim();

    assert.strictEqual(normalizeSource(result), normalizeSource(expectedSource));
  });

  it("should transform S3 and DynamoDB clients when --clients s3,dynamodb is specified", async () => {
    const expectedPath = join(__dirname, "__fixtures__", "clients-option", "output-s3-dynamodb.js");
    const expectedSource = readFileSync(expectedPath, "utf8");

    const result = await transformer(
      { source: inputSource, path: inputPath },
      mockApi,
      { clients: "s3,dynamodb" }
    );

    // Remove comments for comparison since they can vary
    const normalizeSource = (source: string) => 
      source.replace(/\/\/ The `\.promise\(\)` call.*?\n/g, "").trim();

    assert.strictEqual(normalizeSource(result), normalizeSource(expectedSource));
  });

  it("should transform all clients when no --clients option is specified", async () => {
    const result = await transformer(
      { source: inputSource, path: inputPath },
      mockApi,
      {}
    );

    // Should contain imports for all three clients
    assert(result.includes("import { S3 } from '@aws-sdk/client-s3';"));
    assert(result.includes("import { DynamoDB } from '@aws-sdk/client-dynamodb';"));
    assert(result.includes("import { Lambda } from '@aws-sdk/client-lambda';"));
    
    // Should not contain AWS.* constructors
    assert(!result.includes("new AWS.S3()"));
    assert(!result.includes("new AWS.DynamoDB()"));
    assert(!result.includes("new AWS.Lambda()"));
  });
});
