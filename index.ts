import { S3Handler } from 'aws-lambda';

export const readFile: S3Handler = async (event) => {
  // 1. accept the S3 bucket event
  // 2. parse only the correct format csv file
  // 3. save the file in dynamoDB
  // 4. send invalid ext file as error message to sns
};
