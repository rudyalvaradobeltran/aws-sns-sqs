import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SnsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export class S3LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new Bucket(this, 'new-bucket', {
      bucketName: 'aws-sqs-sns-bucket',
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const sqsFailedEventQueue = new Queue(this, 'sqs-failed-event-queue');

    const sqsEventQueue = new Queue(this, 'sqs-event-queue', {
      deadLetterQueue: {
        queue: sqsFailedEventQueue,
        maxReceiveCount: 3
      }
    });

    const snsTopic = new Topic(this, "snsTopic");

    snsTopic.addSubscription(new SqsSubscription(sqsEventQueue));

    s3Bucket.addEventNotification(EventType.OBJECT_CREATED, new SnsDestination(snsTopic));

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
