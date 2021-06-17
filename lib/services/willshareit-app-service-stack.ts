import * as cdk from '@aws-cdk/core';
import {Table, AttributeType, BillingMode} from '@aws-cdk/aws-dynamodb';
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import { Runtime } from '@aws-cdk/aws-lambda';
import { HttpApi, CorsHttpMethod, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import path from 'path';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

/**
 * PAJ - Stack to define
 * Lambda functions
 * DynamoDB
 */
interface IWillshareitAppStackProps extends cdk.StackProps {
  AWS_SES_REGION: string;
  SES_EMAIL_FROM: string;
}

export class WillshareitAppServiceStack extends cdk.Stack {
  private readonly productName: string;
  private readonly tableName: string;

  constructor(scope: cdk.Construct, id: string, props: IWillshareitAppStackProps) {
    super(scope, id, props);   
    const { AWS_SES_REGION, SES_EMAIL_FROM } = props;     
    this.productName = 'WillshareitApp';
    this.tableName = `meetings`;

    // Create Dynamo DB Table
    const table = new Table(this, 'MeetingsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: this.tableName
    });

    // Create Lambda functions
    const createMeetingLambda = new NodejsFunction(this, `${this.productName}CreateMeetingLambda`, {
      runtime: Runtime.NODEJS_12_X,
      entry: path.join(__dirname, '..','..','src','meetings','create.ts'),
      handler: 'createMeeting',
      environment: {
        TABLE_NAME: table.tableName,
        AWS_REGION_WEBRTC_SETUP: 'us-east-1',
        AWS_SES_REGION,
        SES_EMAIL_FROM
      }
    });

    const getMeetingLambda = new NodejsFunction(this, `${this.productName}GetMeetingLambda`, {
      runtime: Runtime.NODEJS_12_X,
      entry: path.join(__dirname, '..','..','src','meetings','get.ts'),
      handler: 'getMeeting',
      environment: {
        TABLE_NAME: table.tableName,
        AWS_REGION_WEBRTC_SETUP: 'us-east-1'
      }
    });


    // Integration - create
    const createMeetingLambdaIntegration = new LambdaProxyIntegration({
      handler: createMeetingLambda
    });

    // Integration - get
    const getMeetingLambdaIntegration = new LambdaProxyIntegration({
      handler: getMeetingLambda
    });

    // Grant READ WRITE IAM Rules to Lambda function
    table.grantReadWriteData(createMeetingLambda);
    table.grantReadWriteData(getMeetingLambda);

    // API Gateway & Routes
    // Route
    const httpApi = new HttpApi(this, `${this.productName}HttpApi`, {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST]
      },
      apiName: 'meetings',
      createDefaultStage: true
    });

    httpApi.addRoutes({
        path: '/meetings',
        methods: [HttpMethod.POST],
        integration: createMeetingLambdaIntegration
    });

    httpApi.addRoutes({
      path: '/meetings',
      methods: [HttpMethod.GET],
      integration: getMeetingLambdaIntegration
  });

  

    

    // CLOUDFUNCTIONS

    // Create cloud function lambda Arn for deployment process
    new cdk.CfnOutput(this, `${this.productName}CreateMeetingLambdaOutput`, {
      value: createMeetingLambda.functionArn,
      exportName: `${this.productName}CreateMeetingLambdaOutput`
    });

    new cdk.CfnOutput(this, `${this.productName}GetMeetingLambdaOutput`, {
      value: getMeetingLambda.functionArn,
      exportName: `${this.productName}GetMeetingLambdaOutput`
    });

    // Create cloud dynamo lambda Arn for deployment process
    new cdk.CfnOutput(this, `${this.productName}DyanmoTableOutput`, {
      value: table.tableArn,
      exportName: `${this.productName}DyanmoTableOutput`
    });

    // API Gateway URL output
    new cdk.CfnOutput(this, `${this.productName}MeetingAPIURL`, {
      value: httpApi.url!,
      exportName: `${this.productName}MeetingAPIURL`
    });

  }
}
