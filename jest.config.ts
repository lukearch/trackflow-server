import { Config } from 'jest';
import { compilerOptions } from './tsconfig.json';

const moduleNameMapper = {};

Object.entries(compilerOptions.paths).forEach((path) => {
  moduleNameMapper[path[0].replace('*', '(.*)')] = `<rootDir>/$1`;
});

const config: Config = {
  moduleFileExtensions: ['ts', 'json', 'js'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper
};

export default config;
