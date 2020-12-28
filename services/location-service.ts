import { S3 } from 'aws-sdk';
import { parse, ParseResult } from 'papaparse';
import { DynamoDBHelper } from '../libs/dynamodb-helper';

import { Location } from '../models/location';

const CHUNK_SIZE = 1024;

export class LocationServices {
  static extractLocations(fileData: S3.GetObjectOutput) {
    const locations: Location[] = [];
    parse<Location>(fileData.Body?.toString(), {
      chunkSize: CHUNK_SIZE,
      header: true,
      chunk: results => this.getLocations(results, locations),
      complete: () => console.log('complete', locations),
      error: error => console.log(error),
    });
    return locations;
  }

  private static getLocations(results: ParseResult<Location>, locations: Location[]) {
    for (const row of results.data) {
      const location = new Location();
      location.latitude = row.latitude;
      location.longitude = row.longitude;
      location.address = row.address;
      locations.push(location);
    }
  }

  static async saveLocations(locations: Location[]) {
    const promises: Promise<void>[] = [];
    for (const location of locations) {
      const promise = DynamoDBHelper.put(location).catch(err => console.error(err));
      promises.push(promise);
    }
    await Promise.all(promises);
  }
}
