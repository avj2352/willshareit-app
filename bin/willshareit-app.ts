#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WillshareitAppStack } from '../lib/willshareit-app-stack';
import { WillshareitAppServiceStack } from '../lib/services/willshareit-app-service-stack';
import { WillshareitAppNotificationStack } from '../lib/notification/willshareit-app-notification-stack';

const app = new cdk.App();
const AWS_SES_REGION = 'us-east-1';
const SES_EMAIL_FROM = 'pramod.jingade@gmail.com';
const SES_TOPIC = 'Willshareit';

// 1. Stack to create - S3, CloudFront, Deployment
new WillshareitAppStack(app, 'WillshareitAppStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});

// 2. Stack to create - Dynamo DB, Lambda function
new WillshareitAppServiceStack(app, 'WillshareitAppServiceStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1'},
  AWS_SES_REGION, SES_EMAIL_FROM
});

// 3. Stack to create - Notification Service - S3, SES, SNS
new WillshareitAppNotificationStack(app, 'WillshareitAppNotificationStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1'},
  AWS_SES_REGION, SES_TOPIC, SES_EMAIL_FROM
});
