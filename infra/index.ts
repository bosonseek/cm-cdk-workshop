/* eslint-disable no-new */
import { App } from 'aws-cdk-lib';

import { AppStack } from './BosonStack';

const app = new App();

new AppStack(app, 'BosonStack', {
  stackName: 'BosonStack',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
