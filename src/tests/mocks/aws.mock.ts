import { SESClient } from '@aws-sdk/client-ses';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import aws from '../../config/aws';

jest.mock('../../config/aws', () => ({
    __esModule: true,
    default: mockDeep<SESClient>(),
}));

beforeEach(() => {
    mockReset(awsMock);
});

export const awsMock = aws as unknown as DeepMockProxy<SESClient>;
