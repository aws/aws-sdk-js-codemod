import AccessAnalyzer = require("aws-sdk/clients/accessanalyzer");
import Discovery = require("aws-sdk/clients/discovery");
import ACM = require("aws-sdk/clients/acm");

let accessAnalyzerClient: AccessAnalyzer;
let discoveryClient: Discovery;
let acmClient: ACM;