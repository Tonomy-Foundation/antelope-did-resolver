import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [],
    roots: ['<rootDir>'],
    testMatch: ['**/*.test.ts'],
    resolver: './custom-resolver.cjs',
};

export default config;
