import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    modulePathIgnorePatterns: ['dist'],
};

export default config;
