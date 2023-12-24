import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import 'dotenv/config';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const nestJsLambda = new NodejsFunction(this, 'NestJsLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../dist/main.js'),
      handler: 'handler',
      bundling: {
        externalModules: [
          '@nestjs/microservices',
          '@nestjs/websockets/socket-module',
          'class-validator',
          'class-transformer',
        ],
      },
      timeout: cdk.Duration.seconds(60),
      environment: {
        POSTGRES_HOST: process.env.POSTGRES_HOST!,
        POSTGRES_USER: process.env.POSTGRES_USER!,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
        POSTGRES_DB: process.env.POSTGRES_DB!,
      },
    });

    const rdsAccessPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['rds:*'],
      resources: ['arn:aws:rds:us-east-1:745945733339:db:database-1'],
    });
    nestJsLambda.addToRolePolicy(rdsAccessPolicyStatement);

    // Create an API Gateway
    const api = new apigateway.RestApi(this, 'NestJsApi', {
      restApiName: 'NestJs API',
      description: 'API for the NestJS Lambda function',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['*'],
      },
    });

    const proxyResource = api.root.addResource('{proxy+}');
    const proxyIntegration = new apigateway.LambdaIntegration(nestJsLambda);

    // Handle any HTTP method for any path
    proxyResource.addMethod('ANY', proxyIntegration);
  }
}
