#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Demo33Stack } from '../lib/demo33-stack';

const app = new cdk.App();
new Demo33Stack(app, 'Demo33Stack');
