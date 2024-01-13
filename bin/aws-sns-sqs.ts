#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3LambdaStack } from '../lib/s3LambdaStack';

const app = new cdk.App();
new S3LambdaStack(app, 'S3LambdaMainStack');
