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
                diagnostics: process.env.CI ? true : false
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'],
    testMatch: ['**/*.test.ts'],
};

export default config;
