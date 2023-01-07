// ToDo: Update when transformation is added.
// Current test verifies error is not thrown.
import AWS from "aws-sdk";

const credentials = new AWS.SharedIniFileCredentials({ profile: "my-profile" });