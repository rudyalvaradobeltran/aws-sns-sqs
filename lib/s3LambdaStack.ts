import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class S3LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new Bucket(this, 'new-bucket', {
      bucketName: 'aws-sqs-sns-bucket',
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const lambdaMain = new NodejsFunction(this, 'lambda-main', {
      entry: (join(__dirname, '..', 'src', 'lambda-main', 'index.ts')),
    });

    const s3Source = new S3EventSource(s3Bucket, {
      events: [EventType.OBJECT_CREATED],
    });

    lambdaMain.addToRolePolicy(new PolicyStatement({
      sid: "s3BucketLambdaMainPermission",
      resources: [s3Bucket.arnForObjects("*")],
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"]
    }));

    lambdaMain.addEventSource(s3Source);
  }
}
