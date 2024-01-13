import { Stack, StackProps } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

interface LambdaStackProps extends StackProps {
  s3Source: S3EventSource,
  s3ArnForObjects: string
}

export class LambdaMainStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const lambdaMain = new NodejsFunction(this, 'lambda-main', {
      entry: "../src/lambda-main/index.ts",
    });

    lambdaMain.addToRolePolicy(new PolicyStatement({
      sid: "s3-bucket-lambda-main-permission",
      resources: [props.s3ArnForObjects],
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"]
    }));

    lambdaMain.addEventSource(props.s3Source);
  }
}
