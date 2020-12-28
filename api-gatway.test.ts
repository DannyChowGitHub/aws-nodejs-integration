import { expect } from 'chai';
import { SinonStub, assert } from 'sinon';

import { loadSandbox } from './libs/test-helper';
import { read } from './api-gateway';
import { DynamoDBHelper } from './libs/dynamodb-helper';

describe('api-gateway-handler', () => {

  describe('read', () => {
    let dynamoQueryStub: SinonStub;

    loadSandbox((testSandbox) => {
      dynamoQueryStub = testSandbox.stub(DynamoDBHelper, 'query');
    });

    it('should return location if record found', async () => {
      const dynamoRecords = [{ latitude: 1, longitude: 2, address: 'fake address' }];
      dynamoQueryStub.returns(dynamoRecords);
      const response = await read(
        { pathParameters: { id: 'fakeId' } } as any);
      assert.calledOnce(dynamoQueryStub);
      expect(response.statusCode).eq(200);
      expect(JSON.parse(response.body)).have.deep.members(dynamoRecords);
    });

    it('should return location if record found', async () => {
      const dynamoRecords = [];
      dynamoQueryStub.returns(dynamoRecords);
      const response = await read(
        { pathParameters: { id: 'fakeId' } } as any);
      assert.calledOnce(dynamoQueryStub);
      expect(response.statusCode).eq(404);
      expect(response.body).eq('Location with id [fakeId] not found');
    });
  });
});
