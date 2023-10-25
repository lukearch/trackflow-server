import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { IgnorePropertiesInterceptor } from './ignore-properties.interceptor';

describe('IgnorePropertiesInterceptor', () => {
  let interceptor: IgnorePropertiesInterceptor;
  let reflector: Reflector;
  let context: ExecutionContext;
  let handler: CallHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IgnorePropertiesInterceptor,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn()
          }
        }
      ]
    }).compile();

    context = {
      getHandler: jest.fn(),
      getClass: jest.fn()
    } as any;

    handler = {
      handle: () => of({ prop1: 'value1', prop2: 'value2' })
    } as CallHandler;

    interceptor = module.get(IgnorePropertiesInterceptor);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should extract properties to be ignored from reflector', async () => {
    const extractIgnoredPropsSpy = jest.spyOn(
      interceptor,
      'extractIgnoredProps'
    );

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce([]);

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(extractIgnoredPropsSpy).toHaveBeenCalledWith(context);
  });

  it('should remove ignored properties from the object', async () => {
    const ignoredProperties = ['prop1'];

    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(ignoredProperties);

    const result = await firstValueFrom(
      interceptor.intercept(context, handler)
    );

    expect(result.prop1).toBeUndefined();
    expect(result.prop2).toEqual('value2');
  });

  it('should handle nested properties', async () => {
    const ignoredProperties = ['nested.prop1'];
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(ignoredProperties);

    const result = await firstValueFrom(
      interceptor.intercept(context, {
        handle: () =>
          of({
            nested: {
              prop1: 'nestedValue1',
              prop2: 'nestedValue2'
            }
          })
      } as CallHandler)
    );

    expect(result.nested.prop1).toBeUndefined();
    expect(result.nested.prop2).toEqual('nestedValue2');
  });

  it('should handle non-existing properties', async () => {
    const ignoredProperties = ['nonexistent.prop'];
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(ignoredProperties);

    const result = await interceptor.intercept(context, handler).toPromise();

    expect(result).toEqual({ prop1: 'value1', prop2: 'value2' });
  });
});
