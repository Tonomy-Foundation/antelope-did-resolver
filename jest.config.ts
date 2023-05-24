import type { Config } from 'jest';

const config: Config = {
    transform: {
        '^.+\\.m?tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: './tsconfig.json',
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'],
    testMatch: ['**/*.test.ts'],
    testEnvironment: 'node',
    coverageProvider: 'v8'
}

export default config;
