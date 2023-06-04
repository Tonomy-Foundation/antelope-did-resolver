import { defaults } from 'jest-config';

const config = {
    testEnvironment: 'node',
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
    transform: {
        '^.+\\.m?tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: './tsconfig.json',
            },
        ],
    },
    // // typescript 5 removes the need to specify relative imports as .js, so we should no longer need this workaround
    // // but webpack still requires .js specifiers, so we are keeping it for now
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
    testMatch: ['**/*.test.ts'],
    coverageProvider: 'v8',
};

export default config;
