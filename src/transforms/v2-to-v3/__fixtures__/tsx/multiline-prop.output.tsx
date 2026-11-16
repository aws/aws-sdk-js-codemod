import { S3 } from "@aws-sdk/client-s3";
const client = new S3();
export const App = () => (
  <Widget
    client={
      client
    }
  />
);
