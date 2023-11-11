import AWS from "aws-sdk";

// Client creation with tabs instead of spaces for indentation.
const client = new AWS.DynamoDB({
	accessKeyId: "KEY",
	secretAccessKey: "SECRET"
});