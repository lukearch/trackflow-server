import { Reflector } from '@nestjs/core';
import { IgnorePropertiesInterceptor } from './ignore-properties.interceptor';

describe('IgnorePropertiesInterceptor', () => {
  it('should be defined', () => {
    expect(new IgnorePropertiesInterceptor(new Reflector())).toBeDefined();
  });
});
