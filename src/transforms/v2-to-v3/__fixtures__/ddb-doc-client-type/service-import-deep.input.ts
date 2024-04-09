import AccessAnalyzer from "aws-sdk/clients/accessanalyzer";
import Discovery from "aws-sdk/clients/discovery";
import ACM from "aws-sdk/clients/acm";

let accessAnalyzerClient: AccessAnalyzer;
let discoveryClient: Discovery;
let acmClient: ACM;