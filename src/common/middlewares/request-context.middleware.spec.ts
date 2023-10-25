import { NextFunction, Response } from 'express';
import { IRequest } from '@/common/interfaces/custom-request.interface';
import { requestContext } from './request-context.middleware';

describe('requestContext', () => {
  let mockRequest: IRequest;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {} as IRequest;
    mockResponse = {} as Response;
    mockNext = jest.fn();
  });

  it('should set context and get context properly', () => {
    requestContext(mockRequest, mockResponse, mockNext);

    const key = 'testKey';
    const value = 'testValue';
    mockRequest.setContext(key, value);
    const retrievedValue = mockRequest.getContext<string>(key);

    expect(retrievedValue).toEqual(value);
  });

  it('should throw an error if key does not exist in request context', () => {
    requestContext(mockRequest, mockResponse, mockNext);

    const key = 'nonExistentKey';

    expect(() => mockRequest.getContext(key)).toThrow(Error);
  });

  it('should call next function', () => {
    requestContext(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should have a context storage map initialized', () => {
    requestContext(mockRequest, mockResponse, mockNext);

    expect(mockRequest.contextStorage).toBeInstanceOf(Map);
  });
});
