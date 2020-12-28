import { config } from 'dotenv';

config();

export const awsConfig = {
  region: process.env.AWS_REGION,
  profile: process.env.AWS_PROFILE,
};

export const dynamoDBConfig = {
  locationTableName: process.env.LOCATION_TABLE_NAME || '',
};
