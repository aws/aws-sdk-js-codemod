import { S3 } from "@aws-sdk/client-s3";
const client = new S3();
const identity = <T,>(value: T): T => value;
export const App = () => <>{identity("hello")}</>;
