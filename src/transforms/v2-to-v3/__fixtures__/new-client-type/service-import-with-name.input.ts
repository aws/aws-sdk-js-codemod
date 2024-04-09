import { 
  AccessAnalyzer as AccessAnalyzerClient,
  Discovery as DiscoveryClient,
  ACM as ACMClient
} from "aws-sdk";

let accessAnalyzerClient: AccessAnalyzerClient;
let discoveryClient: DiscoveryClient;
let acmClient: ACMClient;