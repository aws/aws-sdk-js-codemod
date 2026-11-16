import { DynamoDB } from "@aws-sdk/client-dynamodb";
const client = new DynamoDB();
export const App = () => <Widget<string> client={client}>text</Widget>;
