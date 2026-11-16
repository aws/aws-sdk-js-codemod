import AWS from "aws-sdk";
const client = new AWS.S3();
const identity = <T,>(value: T): T => value;
export const App = () => <>{identity("hello")}</>;
