import { APIGatewayProxyEvent } from 'aws-lambda';

import { DynamoDBHelper } from './libs/dynamodb-helper';
import { Location } from './models/location';

export const read = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;
    const locations = await DynamoDBHelper.query(Location, { id });

    if (locations.length === 0) {
      return {
        statusCode: 404,
        body: `Location with id [${id}] not found`,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(locations, null, 2),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error,
    };
  }
};
