# aws-nodejs-integration

# Interview questions in AWS

## branches

[`master`](https://github.com/DannyChowGitHub/aws-nodejs-integration) is including the questions related to upload file to s3 and trigger the dynamodb saving.

[`api-gateway`](https://github.com/DannyChowGitHub/aws-nodejs-integration/tree/api-gateway) is including the questions of using `aws api gateway` as a event trigger.

## Serverless deployment

NOTE: it should have a CI/CD environment for deployment in the real project

``` shell
serverless deploy --aws-profile {aws-profile}
```

the profile of your aws account.

## Run local debug

NOTE: it should implement Serverless AWS lambda invoke to run the code locally in the real project
plus, a `.env` file to run the project locally, check the `.env.example`


``` shell
yarn run-local
```

## Run unit test

NOTE: it should also cover test coverage in the real project, and some of the libs are my real projects libraries so I didn't involve tests on them

``` shell
yarn test
```