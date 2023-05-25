import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './babel.config.json' }],
    },
    transformIgnorePatterns: [],
    roots: ['<rootDir>'],
    testMatch: ['**/*.test.ts'],
};

export default config;
