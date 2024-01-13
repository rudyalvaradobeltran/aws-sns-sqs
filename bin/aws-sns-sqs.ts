#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3Stack';
import { LambdaMainStack } from '../lib/lambdaMainStack';

const app = new cdk.App();
const s3 = new S3Stack(app, 'S3Stack');
new LambdaMainStack(app, 'LambdaMainStack', {
  s3Source: s3.s3Source,
  s3ArnForObjects: s3.s3ArnForObjects
});
