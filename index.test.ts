import { SinonStub, assert } from 'sinon';
import { cloneDeep } from 'lodash';

import { loadSandbox } from './libs/test-helper';
import { S3Helper } from './libs/s3-helper';
import { SNSHelper } from './libs/sns-helper';

import { LocationServices } from './services/location-service';
import { readFile } from './index';
import s3EventJson from './dummy-data/s3-event.json';
import { Location } from './models/location';

describe('csv-handler', () => {

  describe('read', () => {
    let getFileDataStub: SinonStub;
    let extractLocationsStub: SinonStub;
    let saveLocationsStub: SinonStub;
    let sendSNSMsgStub: SinonStub;

    loadSandbox((testSandbox) => {
      getFileDataStub = testSandbox.stub(S3Helper, 'getFileData');
      extractLocationsStub = testSandbox.stub(LocationServices, 'extractLocations');
      saveLocationsStub = testSandbox.stub(LocationServices, 'saveLocations');
      sendSNSMsgStub = testSandbox.stub(SNSHelper, 'sendSNSMsg');
    });

    it('should get file from s3 and save locations', async () => {
      getFileDataStub.returns({ data: [{ latitude: '140.2211212' }] });
      const dummyLocations = new Location();
      dummyLocations.address = 'where';
      dummyLocations.id = 'uuid';
      dummyLocations.latitude = '140.2211212';
      dummyLocations.longitude = '-100.2121212';
      extractLocationsStub.returns([dummyLocations]);
      await readFile(s3EventJson, null as any, null as any);
      assert.calledOnce(getFileDataStub);
      assert.calledOnce(extractLocationsStub);
      assert.calledOnce(saveLocationsStub);
      assert.notCalled(sendSNSMsgStub);
    });

    it('should only call send sns topic when the one record event is not cvs ', async () => {
      const invalidExtEvent = cloneDeep(s3EventJson);
      invalidExtEvent.Records[0].s3.object.key = 'test.txt';
      await readFile(invalidExtEvent, null as any, null as any);
      assert.notCalled(getFileDataStub);
      assert.notCalled(extractLocationsStub);
      assert.notCalled(saveLocationsStub);
      assert.calledOnce(sendSNSMsgStub);
    });

    it('should call get file from s3 and save locations and send sns topic when the event records with both csv and not csv', async() => {
      getFileDataStub.returns({ data: [{ latitude: '140.2211212' }] });
      const dummyLocations = new Location();
      dummyLocations.address = 'where';
      dummyLocations.id = 'uuid';
      dummyLocations.latitude = '140.2211212';
      dummyLocations.longitude = '-100.2121212';
      extractLocationsStub.returns([dummyLocations]);
      const invalidExtEvent = cloneDeep(s3EventJson.Records[0]);
      invalidExtEvent.s3.object.key =  'test.txt';
      s3EventJson.Records.push(invalidExtEvent);
      await readFile(s3EventJson, null as any, null as any);
      assert.calledOnce(getFileDataStub);
      assert.calledOnce(extractLocationsStub);
      assert.calledOnce(saveLocationsStub);
      assert.calledOnce(sendSNSMsgStub);
    });
  });
});
