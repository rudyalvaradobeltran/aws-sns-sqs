import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { EventType } from 'aws-cdk-lib/aws-s3';

export class S3Stack extends cdk.Stack {
  public readonly s3Source: S3EventSource;
  public readonly s3ArnForObjects: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'new-bucket', {
      bucketName: 'aws-sqs-sns-bucket',
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    this.s3Source = new S3EventSource(bucket, {
      events: [EventType.OBJECT_CREATED],
    });

    this.s3ArnForObjects = bucket.arnForObjects("*");
  }
}
