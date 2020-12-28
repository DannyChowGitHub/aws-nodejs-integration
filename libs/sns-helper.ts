import { SNS, SharedIniFileCredentials, S3 } from 'aws-sdk';

import { awsConfig } from '../config/aws';

export class SNSHelper {
  static snsOptions = SNSHelper.getSNSOptions();
  static sns = new SNS(SNSHelper.snsOptions);

  private static getSNSOptions() {
    const options: SNS.ClientConfiguration = {
      credentials: new SharedIniFileCredentials({ profile: awsConfig.profile }),
      region: awsConfig.region,
    };
    return options;
  }

  static async sendSNSMsg(topicArn: string, msg: string) {
    const params: SNS.PublishInput = {
      TopicArn: topicArn,
      Message: msg,
    };
    await this.sns.publish(params).promise();
  }
}
