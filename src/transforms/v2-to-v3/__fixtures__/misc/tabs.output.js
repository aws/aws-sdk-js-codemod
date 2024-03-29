import { DynamoDB } from "@aws-sdk/client-dynamodb";

// Client creation with tabs instead of spaces for indentation.
const client = new DynamoDB({
	credentials: {
		accessKeyId: "KEY",
		secretAccessKey: "SECRET"
	}
});

// Spaces inside string should not be replaced.
const stringWithFourSpaces = "    ";