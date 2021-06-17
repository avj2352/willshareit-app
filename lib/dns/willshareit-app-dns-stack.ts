import { Certificate, CertificateValidation, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IPublicHostedZone, PublicHostedZone } from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

interface IWillshareitAppDnsStackProps extends cdk.StackProps {
  dnsName: string;
}

/**
 * PAJ - Code for managing DNS, Hosted Zone & Certificate
 */
export class WillshareitAppDnsStack extends cdk.Stack {
  private readonly _hostedZone: IPublicHostedZone;
  private readonly _certificate: ICertificate;

  constructor(scope: cdk.Construct, id: string, props: IWillshareitAppDnsStackProps) {
    super(scope, id, props);

    this._hostedZone = new PublicHostedZone(this, 'WillshareitAppHostedZone', {
      zoneName: props.dnsName
    });

    this._certificate = new Certificate(this, 'WillshareitAppCertificateManager', {
      domainName: props.dnsName,
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

  }
  // getter - _hostedZone
  public get hostedZone() { return this._hostedZone; }
  // getter - _certificate
  public get certificate() { return this._certificate; }
}
