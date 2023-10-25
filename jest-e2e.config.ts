import { Config } from 'jest';
import JestConfig from './jest.config';

const config: Config = {
  ...JestConfig,
  testRegex: '.e2e-spec.ts$',
  rootDir: 'test',
  verbose: true
};

export default config;
