
const cdk = require('@aws-cdk/core');
const {CodePipeline, CodePipelineSource, ShellStep} = require('@aws-cdk/pipelines');
const s3 = require('@aws-cdk/aws-s3')
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

        const s3Staging = new s3.Bucket(this, 'staging', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        //Test
        const pipeline = new CodePipeline(this, 'reactAppPipelineId', {
            pipelineName: 'reactAppPipelineName',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('yoga2005live/reactapp', 'master',
                    {authentication: SecretValue.secretsManager('arn:aws:secretsmanager:us-east-2:975663573741:secret:github-oauth-token_1-80vZpc')}
                ),
                commands: ['ls -a -l --color', 'npm ci', 'ls -a -l --color', 'npm run build', 'ls -a -l --color', 'npx cdk synth', 'ls -a -l --color'],
                output: s3Staging
            })
        });

    }
}

module.exports = {CdkPipeLineStack}
