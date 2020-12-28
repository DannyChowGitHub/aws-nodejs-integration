import { DataMapper, PutOptions, QueryOptions } from '@aws/dynamodb-data-mapper';
import { DynamoDB, SharedIniFileCredentials } from 'aws-sdk';
import { ZeroArgumentsConstructor } from '@aws/dynamodb-data-marshaller';
import { omit } from 'lodash';

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

  static async query<T>(
    model: ZeroArgumentsConstructor<T>,
    where: Partial<T>,
    options?: QueryOptions,
  ) {
    const results: T[] = [];
    for await (const result of this.mapper.query(model, where, options)) {
      results.push(omit(result as any, ['mapper']));
    }
    return results;
  }
}
