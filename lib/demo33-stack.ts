import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { join } from "path";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

export class Demo33Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const nodejsFunctionProps = {
      bundling: { externalModules: ['aws-sdk'] },
      runtime: Runtime.NODEJS_14_X
    }

    const bulkMathProcess = new NodejsFunction(this, 'bulkMathProcessLambdaFunction', {
      entry: join(__dirname, `/../lambda/bulkMathProcess.js`),
      ...nodejsFunctionProps,
    });

    const apigwForBulkMathProcess = new LambdaRestApi(this, 'bulkMathProcessEndpoint', {
      restApiName: 'Super Maths Service',
      handler: bulkMathProcess,
      proxy: false
    })

    const gw = apigwForBulkMathProcess.root.addResource('supermathsservice')
    gw.addMethod('POST')

    gw.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowHeaders: ['*']
    });

    // // start - dad joke section

//option-1
    const jokeLambda = new NodejsFunction(this, 'JokeHandler', {
      entry: join(__dirname, `/../lambda/joke.js`),
      ...nodejsFunctionProps,
    });
//option-1
//option-2
// const myLayer = new lambda.LayerVersion(this, 'MyLayer', {
//   code: lambda.Code.fromAsset(join(__dirname, '/../lambda')), // path to the directory with your layer code
//   compatibleRuntimes: [lambda.Runtime.NODEJS_14_X], // set the runtime compatible with the layer
//   description: 'A layer to hold the external package dependency',
//   layerVersionName: 'my-layer',
// });

//08Aug23: Option-2 is in effect except the layer. layer should not be used as included here hence commented

    const jokeLambda2 = new lambda.Function(this, 'JokeHandler2', {
      code: lambda.Code.fromAsset(join(__dirname, '/../lambda')), // path to the directory with your function code
      handler: 'joke.handler', // specify the file and the export to use as the handler
      runtime: lambda.Runtime.NODEJS_14_X, // set the runtime
      // layers: [myLayer], // add the layer to the function
    });

    const apigwForJoke = new LambdaRestApi(this, 'jokeEndpoint', {
      restApiName: 'Joke',
      handler: jokeLambda2,
      proxy: false
    })

    const gwJoke = apigwForJoke.root.addResource('joke')
    gwJoke.addMethod('POST')

    gwJoke.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowHeaders: ['*']
    });

    let pathExtentionJoke = gwJoke.path.replace(/^./, "")
    new CfnOutput(this, 'hitTHISForJoke', {
      value: `${apigwForJoke.url}${pathExtentionJoke}`,
      description: 'hitTHISForJoke',
      exportName: 'hitTHISForJoke',
    })
    // // end - dad joke section


  

    new CfnOutput(this, 'endpointExportNameForSuperMathService', {
      value: gw.path,
      description: 'endpoint Export Name For Super Math Service',
      exportName: 'endpointExportNameForSuperMathService',
    })

    new CfnOutput(this, 'endpointURLForSuperMathService', {
      value: apigwForBulkMathProcess.url,
      description: 'endpoint URL For Super Math Service',
      exportName: 'endpointURLForSuperMathService',
    })
    let pathExtention = gw.path.replace(/^./, "")
    new CfnOutput(this, 'hitTHISForSuperMathService', {
      value: `${apigwForBulkMathProcess.url}${pathExtention}`,
      description: 'hitTHISForSuperMathService',
      exportName: 'hitTHISForSuperMathService',
    })

  }
}
