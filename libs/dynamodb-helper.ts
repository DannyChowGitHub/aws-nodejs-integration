import { DataMapper, PutOptions } from '@aws/dynamodb-data-mapper';
import { DynamoDB, SharedIniFileCredentials } from 'aws-sdk';
import { awsConfig } from '../config/aws';

const DYNAMO_DB_OPTIONS: DynamoDB.ClientConfiguration = {
  credentials: new SharedIniFileCredentials({ profile: awsConfig.profile }),
  region: awsConfig.region,
};

export class DynamoDBHelper {
  static dynamoClient = new DynamoDB(DYNAMO_DB_OPTIONS);
  static mapper = DynamoDBHelper.getDefaultMapper();

  private static getDefaultMapper() {
    return new DataMapper({
      client: DynamoDBHelper.dynamoClient,
    });
  }

  static async put<T>(item: T, options?: PutOptions) {
    await this.mapper.put(item, options);
  }
}
