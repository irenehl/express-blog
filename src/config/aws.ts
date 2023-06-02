import { SESClient } from '@aws-sdk/client-ses';

const aws = new SESClient({ region: 'us-east-1' });
export default aws;
