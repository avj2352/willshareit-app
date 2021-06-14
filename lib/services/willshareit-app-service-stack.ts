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
export class WillshareitAppServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Dynamo DB Table
    const table = new Table(this, 'MeetingsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'meetings'
    });

    // Create Lambda functions
    const createMeetingLambda = new NodejsFunction(this, 'WillshareitAppCreateMeetingLambda', {
      runtime: Runtime.NODEJS_12_X,
      entry: path.join(__dirname, '..','..','src','meetings','create.ts'),
      handler: 'createMeeting',
      environment: {
        TABLE_NAME: table.tableName
      }
    });
    // Integration
    const createMeetingLambdaIntegration = new LambdaProxyIntegration({
      handler: createMeetingLambda
    });

    // Grant READ WRITE IAM Rules to Lambda function
    table.grantReadWriteData(createMeetingLambda);

    // API Gateway & Routes
    // Route
    const httpApi = new HttpApi(this, 'WillshareitAppHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST]
      },
      apiName: 'meetings',
      createDefaultStage: true
    });

    httpApi.addRoutes(
      {
        path: '/meetings',
        methods: [HttpMethod.POST],
        integration: createMeetingLambdaIntegration
      }      
    );
    

    // CLOUDFUNCTIONS

    // Create cloud function lambda Arn for deployment process
    new cdk.CfnOutput(this, 'WillshareitAppCreateMeetingLambdaOutput', {
      value: createMeetingLambda.functionArn,
      exportName: 'WillshareitAppCreateMeetingLambdaOutput'
    });

    // Create cloud dynamo lambda Arn for deployment process
    new cdk.CfnOutput(this, 'WillshareitAppDyanmoTableOutput', {
      value: table.tableArn,
      exportName: 'WillshareitAppDyanmoTableOutput'
    });

    // API Gateway URL output
    new cdk.CfnOutput(this, 'WillshareitAppCreateMeetingURL', {
      value: httpApi.url!,
      exportName: 'WillshareitAppCreateMeetingURL'
    });

  }
}
