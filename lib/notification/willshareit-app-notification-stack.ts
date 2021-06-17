import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as ses from '@aws-cdk/aws-ses';
import * as actions from '@aws-cdk/aws-ses-actions';
import * as sns from '@aws-cdk/aws-sns';

/**
 * PAJ - Stack to define
 * SES Service
 * SQS Service
 */
interface IWillshareitAppNotificationStackProps extends cdk.StackProps {
    AWS_SES_REGION: string;
    SES_EMAIL_FROM: string;
    SES_TOPIC: string;
}

 export class WillshareitAppNotificationStack extends cdk.Stack {
    private readonly productName: string;

    constructor(scope: cdk.Construct, id: string, props: IWillshareitAppNotificationStackProps) {
        super(scope, id, props);
        const { AWS_SES_REGION, SES_EMAIL_FROM, SES_TOPIC } = props;
        this.productName = `WillshareitApp`;

        // Step 1: Create S3 bucket for outputting email logs
        const bucket = new s3.Bucket(this, 'EmailBucket');
        const topic = new sns.Topic(this, SES_TOPIC);

        new ses.ReceiptRuleSet(this, 'RuleSet', {
            rules: [
              {
                recipients: ['*'],
                actions: [
                  new actions.AddHeader({
                    name: 'X-Special-Header',
                    value: 'aws'
                  }),
                  new actions.S3({
                    bucket,
                    objectKeyPrefix: 'emails/',
                    topic
                  })
                ],
              },
              {
                recipients: ['*'],
                actions: [
                  new actions.Sns({
                    topic
                  })
                ]
              }
            ]
          });

        //

    }
 }