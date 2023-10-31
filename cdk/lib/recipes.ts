import { AccessScope } from "@guardian/cdk/lib/constants";
import { GuDistributionBucketParameter, type GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { GuEc2App } from "@guardian/cdk/lib/patterns/";
import type { App } from "aws-cdk-lib";
import { AttributeType, Table, TableEncryption } from "aws-cdk-lib/aws-dynamodb";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { Bucket } from 'aws-cdk-lib/aws-s3';

const appName = "recipes";
const appDomainName = 'recipes.gutools.co.uk';

export class Recipes extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);
    const artifactBucketName = GuDistributionBucketParameter.getInstance(this).valueAsString;
    const ec2App = new GuEc2App(this, {
      applicationPort: 9000,
      app: appName,
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      access: { scope: AccessScope.PUBLIC },
      userData: [
        ' #!/bin/bash -ev',
        'mkdir /etc/gu',
        "cat > /etc/gu/stage <<'EOF'",
        this.stage,
        'EOF',
        `aws --quiet --region ${this.region} s3 cp s3://${artifactBucketName}/${this.stack}/${this.stage}/${appName}/${appName}.conf /etc/gu/recipes.conf`,
        `aws --quiet --region ${this.region} s3 cp s3://${artifactBucketName}/${this.stack}/${this.stage}/${appName}/${appName}.deb /tmp/package.deb`,
        'dpkg -i /tmp/package.deb',
      ].join('\n'),
      certificateProps: {
        domainName: appDomainName,
      },
      monitoringConfiguration: { noMonitoring: true },
      scaling: {
        minimumInstances: 1,
        maximumInstances: 2,
      },
      applicationLogging: {
        enabled: true,
        systemdUnitName: appName,
      },
      imageRecipe: 'editorial-tools-focal-java8',
    })
    const rawRecipesTable = new Table(this, 'rawRecipesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      deletionProtection: true,
      encryption: TableEncryption.AWS_MANAGED,
    });
    rawRecipesTable.grantReadData(ec2App.autoScalingGroup.role);
    const curatedRecipesTable = new Table(this, 'curatedRecipesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      deletionProtection: true,
      encryption: TableEncryption.AWS_MANAGED,
    });
    curatedRecipesTable.grantReadWriteData(ec2App.autoScalingGroup.role);
    const bucket = Bucket.fromBucketName(this, 'pan-domain-auth-settings', 'pan-domain-auth-settings');
    bucket.grantRead(ec2App.autoScalingGroup.role, '*public');
  }
}
