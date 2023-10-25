import { Config } from 'jest';
import { join } from 'path';
import { compilerOptions } from './tsconfig.json';

const moduleNameMapper = {};

Object.entries(compilerOptions.paths).forEach((path) => {
  moduleNameMapper[path[0].replace('*', '(.*)')] = `${join(
    process.cwd(),
    path[1][0].replace('*', '$1')
  )}`;
});

const config: Config = {
  moduleFileExtensions: ['ts', 'json', 'js'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'interfaces',
    '.module.ts',
    '<rootDir>/main.ts',
    '.decorator.ts'
  ],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50
    }
  }
};

export default config;
