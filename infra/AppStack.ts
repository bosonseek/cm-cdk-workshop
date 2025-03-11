import {
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
  aws_lambda,
  aws_lambda_event_sources,
  aws_lambda_nodejs,
  aws_sns,
  aws_sns_subscriptions,
  aws_sqs,
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // a SNS topic
    const snsTopic = new aws_sns.Topic(this, 'snsTopic', {
      topicName: 'snsTopic',
      displayName: 'snsTopic',
    });

    // a SQS DLQ
    const workerDLQ = new aws_sqs.Queue(this, 'workerDLQ', {
      queueName: 'workerDLQ',
      retentionPeriod: Duration.days(14),
      removalPolicy: RemovalPolicy.DESTROY,
      visibilityTimeout: Duration.seconds(1),
    });

    // a SQS queue
    const workerQueue = new aws_sqs.Queue(this, 'workerQueue', {
      queueName: 'workerQueue',
      retentionPeriod: Duration.days(14),
      removalPolicy: RemovalPolicy.DESTROY,
      visibilityTimeout: Duration.seconds(1),
      deadLetterQueue: {
        maxReceiveCount: 1,
        queue: workerDLQ,
      },
    });

    // a Lambda function
    const lambdaFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'lambdaFunction',
      {
        entry: 'src/index.ts',
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        architecture: aws_lambda.Architecture.ARM_64,
        handler: 'handler',
        functionName: 'lambdaFunction',
        reservedConcurrentExecutions: 1,
        timeout: Duration.seconds(10),
        memorySize: 128,
        environment: {
          FRIDAY: 'Monday',
          VERSION: '0.2',
        },
      },
    );

    lambdaFunction.addEventSource(
      new aws_lambda_event_sources.SqsEventSource(workerQueue),
    );

    snsTopic.addSubscription(
      new aws_sns_subscriptions.SqsSubscription(workerQueue, {
        rawMessageDelivery: true,
        deadLetterQueue: workerDLQ,
      }),
    );

    // a dynamoDB table
  }
}
