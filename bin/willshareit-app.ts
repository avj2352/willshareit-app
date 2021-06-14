#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WillshareitAppStack } from '../lib/willshareit-app-stack';
import { WillshareitAppServiceStack } from '../lib/services/willshareit-app-service-stack';

const app = new cdk.App();

// 1. Stack to create - S3, CloudFront, Deployment
new WillshareitAppStack(app, 'WillshareitAppStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});

// 2. Stack to create - Dynamo DB, Lambda function
new WillshareitAppServiceStack(app, 'WillshareitAppServiceStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});
