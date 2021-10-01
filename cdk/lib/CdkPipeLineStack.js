const cdk = require('@aws-cdk/core');
const {CodePipeline, CodePipelineSource, ShellStep} = require('@aws-cdk/pipelines');
const s3 = require('@aws-cdk/aws-s3')
const s3Deploy = require('@aws-cdk/aws-s3-deployment')
const {SecretValue} = require("@aws-cdk/core");

class CdkPipeLineStack extends cdk.Stack {
    /**
     *
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'reactAppPipelineId', {
            pipelineName: 'reactAppPipelineName',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('yoga2005live/reactapp', 'master',
                    {authentication: SecretValue.secretsManager('arn:aws:secretsmanager:us-east-2:975663573741:secret:github-oauth-token_1-80vZpc')}
                ),
                commands: [
                    'npm i',
                    'ls -a -l --color',
                    'npm run build',
                    'ls -a -l --color',
                    'apt install zip',
                    'mv build reactApp',
                    'ls -a -l --color',
                    'mkdir "build_$(date +\'%mM_%dD_%yY_%HH\')"',
                    'ls -a -l --color',
                    'mv reactApp "build_$(date +\'%mM_%dD_%yY_%HH\')"',
                    'mv server/server_dev.js "build_$(date +\'%mM_%dD_%yY_%HH\')"',
                    'zip -r "build_$(date +\'%mM_%dD_%yY_%HH\')".zip "build_$(date +\'%mM_%dD_%yY_%HH\')"',
                    'mkdir build',
                    'mv "build_$(date +\'%mM_%dD_%yY_%HH\')".zip build',
                    'ls -a -l --color',
                    'cd cdk', 'npm ci',
                    'ls -a -l --color',
                    'npm run build',
                    'ls -a -l --color',
                    'npx cdk synth',
                    'ls -a -l --color'
                ],
                primaryOutputDirectory: 'cdk/cdk.out',
                // output: s3Staging
            })
        });

        const s3Staging = new s3.Bucket(this, 'staging', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects:true
        });
        const s3Deployment = new s3Deploy.BucketDeployment(this, 'cdkDeployBucket', {
            sources:[s3Deploy.Source.asset("../build")],
            destinationBucket: s3Staging
        });

    }
}

module.exports = {CdkPipeLineStack}
