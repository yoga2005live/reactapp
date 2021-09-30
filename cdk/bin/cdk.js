#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const {CdkPipeLineStack} = require('../lib/CdkPipeLineStack');

const app = new cdk.App();

const pipeLineStack = new CdkPipeLineStack(app, 'CdkReactAppStack', {
    env: {
        region: 'us-east-2'
    }
});

app.synth();
