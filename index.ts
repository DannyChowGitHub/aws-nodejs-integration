import { S3Handler } from 'aws-lambda';
import { isEmpty } from 'lodash';

import { LocationServices } from './services/location-service';
import { S3Helper } from './libs/s3-helper';
import { SNSHelper } from './libs/sns-helper';

const EVENT_SOURCE = 'aws:s3';
const EVENT_NAME = 'ObjectCreated:Put';
const ALLOWED_EXTS = ['csv'];
const TOPIC_ARN = 'arn:aws:sns:us-east-2:123456789012:InvalidExtFiles';

export const readFile: S3Handler = async (event) => {
  const forbiddenExtErrs: Error[] = [];
  try {
    for (const record of event.Records) {
      if (record.eventSource === EVENT_SOURCE && record.eventName === EVENT_NAME) {
        const bucketName = record.s3.bucket.name;
        const fileName = record.s3.object.key;
        const fileExt = fileName.split('.').pop() || '';
        if (ALLOWED_EXTS.includes(fileExt)) {
          const fileData = await S3Helper.getFileData(bucketName, fileName);
          const locations = LocationServices.extractLocations(fileData);
          await LocationServices.saveLocations(locations);
        } else {
          const errMsg = `[Forbidden Exts]: bucketName: ${bucketName}, fileName; ${fileName}`;
          forbiddenExtErrs.push(new Error(errMsg));
        }
      }
    }
    if (!isEmpty(forbiddenExtErrs)) {
      SNSHelper.sendSNSMsg(TOPIC_ARN, JSON.stringify(forbiddenExtErrs));
    }
  } catch (error) {
    console.log(error);
  }
};
