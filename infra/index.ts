/* eslint-disable no-new */
import { App } from 'aws-cdk-lib';

import { AppStack } from './AppStack';

const app = new App();

new AppStack(app, 'AppStack', {
  stackName: 'AppStack',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
