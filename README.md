# Welcome to your CDK TypeScript project!


## Important Links
- [AWS - Cors rules](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
- [AWS Chime - Out of scope for Cloudformation / CDK](https://github.com/aws/aws-cdk/issues/9268)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/api/latest/)
- [Udemy AWS CDK Course](https://www.udemy.com/course/aws-cdk-course)
- [CDK Patterns for Serverless](https://github.com/cdk-patterns/serverless)
- [Setup Serverless - Lambda + Dynamo DB, using AWS CDK](https://taimos.de/blog/build-a-basic-serverless-application-using-aws-cdk)
- [Dynamo DB basics](https://www.youtube.com/watch?v=T6VZ_GfQdvo)
- [Dynamo DB GSI](https://www.xerris.com/insights/dynamodb-introduction-hands-on-with-gsi-and-lsi/)

This is a blank project for TypeScript development with CDK.

## Quick access to AWS CDK

```bash
> cdk doc
```

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Initializing your Project with CDK Typescript

```bash
> mkdir <your-project-name>
> cd <your-project-name>
> cdk init app --language=typescript
```

>  This uses the **app** template to create your project. **The main class will take the name of your folder** 

Lastly, enable esModuleInterop feature of Typescript `tsconfig.json`

```json
"esModuleInterop": true
```

also, enable this feature for creating builds using AWS-CDK

```bash
# this will skip docker and use javascript to transpile your typescript source code
> npm install -D esbuild
```

## Checking & Updating CDK version

```bash
# To install latest version of CDK 
> sudo npm install -g aws-cdk@latest
# To check the version of CDK
> cdk --version
# To check outdated packages
> npm outdated
# To update to latest version packages
> npm update
# NOTE: npm update only works on packages which have a leading ^ symbol in them
```

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

---

## Creating a S3 bucket using CDK

### 1. Create S3 Bucket Configuration


> NOTE: First ensure to match your S3 dependency to the aws-cdk/core version

```bash
# Need the following core S3 bucket module
> npm install @aws-cdk/aws-s3@1.108.1
# Need for deployment of S3 bucket
> npm install @aws-cdk/aws-s3-deployment@1.108.1
```

You need the following dependencies for creating, deploying S3 bucket along with Hosted domains and Certificates

```json
{    
    "@aws-cdk/aws-certificatemanager": "^1.108.1",
    "@aws-cdk/aws-route53": "^1.108.1",
    "@aws-cdk/aws-route53-targets": "^1.108.1",
    "@aws-cdk/aws-s3": "^1.108.1",
    "@aws-cdk/aws-s3-deployment": "^1.108.1",
    "@aws-cdk/core": "1.108.1",
}
```

* You then need to navigate to the bin folder and enter the following

```javascript
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

export class SimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const bucket = new Bucket(this, 'MySimpleApp', {
      encryption: BucketEncryption.S3_MANAGED
    });

    // The code that defines your stack goes here
  }
}
```

### 2. Bootstrap CDK Toolkit into AWS

* This is by running the following command in the terminal

```bash
> cdk bootstrap
```

### 3. List Stack

* This is by running the following command

```bash
> cdk list
# SimpleAppStack
```

### 4. Deploy Stack

* This is by running the command

```bash
> cdk deploy
```

> CDK creates 2 resources

- CDKMetadata - This contains information about the CloudFormation build
- Bucket - The bucket that we configured above

CDK then displays the ARN (Amazon Resource Name) in the terminal

```bash
Stack ARN:
arn:aws:cloudformation:eu-west-1:533935803992:stack/SimpleAppStack/c0bee2e0-cb36-11eb-8acc-02364ade655f
```

---

## CDK Synthesize

The following command shows what changes we made locally versus what's already deployed to AWS

```bash
> cdk diff
```

You can create the template for the CloudFormation deployment using CDK's `synthesize` command.

```bash
> cdk synthesize --output=./templates
```

The above command will create the following file structure under the `templates` folder of your project

```
- cdk.out
- manifest.json
- SimpleAppStack.template.json
- tree.json
```

The `SimpleAppStack.template.json` can be used to pass our test scripts now

> NOTE: Make sure to remove CDKMetadata information from your Resources object when copying over to testscripts.

---

## Testing CDK build scripts

In order to perform simple test assertions, import from `@aws-cdk/assert/jest`

This will allow us to write simpler assertions as follows:

```javascript
import * as cdk from '@aws-cdk/core';
import {PortfolioSiteStack} from '../lib/portfolio-site-stack';
import {PortfolioSiteDnsStack} from '../lib/portfolio-site-dns-stack';
import '@aws-cdk/assert/jest';


test('Expect the DNS Stack to contain - CertificateManager - HostedZone', () => {
  // ARRANGE
  const domainNameApex = 'online-meetings.cloud.dk';
  const app = new cdk.App();    
  // ACT
  const dnsStack = new PortfolioSiteDnsStack(app, 'MyTestDnsStack', {
    dnsName: domainNameApex
  });
  // ASSERT
  expect(dnsStack).toHaveResource('AWS::CertificateManager::Certificate');
  expect(dnsStack).toHaveResource('AWS::Route53::HostedZone');
});

test('Expect Stack to contain - S3 bucket - CloudFront Distribution', () => {  
  // ARRANGE
  const domainNameApex = 'online-meetings.cloud.dk';
  const app = new cdk.App();    
  // ACT
  const dnsStack = new PortfolioSiteDnsStack(app, 'MyTestDnsStack', {
    dnsName: domainNameApex
  });
  const mainStack = new PortfolioSiteStack(app, 'MyTestStack', {
    dnsName: domainNameApex,
    hostedZone: dnsStack.hostedZone,
    certificate: dnsStack.certificate
  });
  // ASSERT
  expect(mainStack).toHaveResource('AWS::S3::Bucket');
  expect(mainStack).toHaveResource('AWS::CloudFront::Distribution');
  
});
```

---

## What is CDK Toolkit in my AWS Dashboard

The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.

It provides certain features when using in your Terminal

- **cdk diff** : _shows the difference between your local CDK build setup and what was previously deployed_
- **cdk list**: _list all the resources in your build configuration_
- **cdk deploy**: _Provides deployment information and prompts for action_

> - **NOTE:** When you destroy your CloudFormation stack using AWS CDK, your CDKToolkit will still be shown.
> - CDKToolkit is a combination of - S3 bucket & Lambda function with a total size of 500KB only, so it will not be charged for your account.

---

## :beetle: ​Docket error when building resources 

- cdk diff error - spawnSync docker ENOENT
- Workaround - Install Docket OR add the following dev-dependency

```bash
# this will skip docker and use javascript to transpile your typescript source code
> npm install -D esbuild
```



---

## :beetle: ​Setting up SSL and HostedZone

Currently, AWS-CDK doesn't support any other region other than `us-east-1` for hosting SSL certified certificates. So if you need to deploy a SSL certified website then you need to use `us-east-1` region as the default region

- [Details about the SSL certificate issue](https://github.com/aws/aws-cdk/issues/9274)

