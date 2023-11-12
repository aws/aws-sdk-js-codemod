import AWS from "aws-sdk";

// Client creation with tabs instead of spaces for indentation.
const client = new AWS.DynamoDB({
	accessKeyId: "KEY",
	secretAccessKey: "SECRET"
});

// Spaces inside string should not be replaced.
const stringWithFourSpaces = "    ";