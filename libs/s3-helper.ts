import { S3, SharedIniFileCredentials } from 'aws-sdk';

import { awsConfig } from '../config/aws';

export class S3Helper {
  static s3Options = S3Helper.getS3Options();
  static s3 = new S3(S3Helper.s3Options);

  private static getS3Options() {
    const options: S3.ClientConfiguration = {
      credentials: new SharedIniFileCredentials({ profile: awsConfig.profile }),
      region: awsConfig.region,
    };
    return options;
  }

  static async getFileData(bucketName: string, fileName: string) {
    const fileData = await this.s3.getObject({
      Bucket: bucketName, Key: fileName,
    }).promise();

    return fileData;
  }
}
