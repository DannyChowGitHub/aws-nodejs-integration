import { expect } from 'chai';
import { readFileSync } from 'fs';
import { SinonStub, assert } from 'sinon';

import { loadSandbox } from '../libs/test-helper';
import { LocationServices } from '../services/location-service';
import path from 'path';
import { Location } from '../models/location';
import { ParseResult, ParseError, ParseMeta } from 'papaparse';
import { DynamoDBHelper } from '../libs/dynamodb-helper';

describe('LocationServices', () => {
  const filePath = path.join(__dirname, '../dummy-data/locations.csv');
  const testCsv = readFileSync(filePath).toString('utf-8');
  const fileData = {
    Body: {
      toString: () => testCsv,
    },
  };

  describe('extractLocations', () => {
    it('should extract locations from csv', async () => {
      const locations = LocationServices.extractLocations(fileData);
      expect(locations.length).eq(9);
    });
  });

  describe('getLocations', () => {
    it('should return all the props of the location from s3 csv file', async () => {
      const parseResult: ParseResult<Location> = {
        data: [
          { latitude: '14.3122121', longitude: '12.312231', address: 'No.1' },
          { latitude: '14.3122121', longitude: '12.312231', address: 'No.2' },
        ],
        errors: [] as ParseError[],
        meta: {} as ParseMeta,
      };
      const locations: Location[] = [];
      LocationServices.convertLocations(parseResult, locations);
      for (const location of locations) {
        expect(location).haveOwnProperty('latitude');
        expect(location).haveOwnProperty('longitude');
        expect(location).haveOwnProperty('address');
        expect(location).haveOwnProperty('id');
      }
    });
  });

  describe('saveLocations', () => {
    let putStub: SinonStub;

    loadSandbox((testSandbox) => {
      putStub = testSandbox.stub(DynamoDBHelper, 'put');
    });

    it('should save 9 times to dynamodb', async () => {
      putStub.resolves('success');
      const locations = LocationServices.extractLocations(fileData);
      await LocationServices.saveLocations(locations);
      assert.callCount(putStub, locations.length);
    });
  });
});
