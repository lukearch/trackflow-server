import { NextFunction, Response } from 'express';
import { IRequest } from '@/common/interfaces/custom-request.interface';

export const requestContext = (
  req: IRequest,
  _: Response,
  next: NextFunction
) => {
  req.contextStorage = new Map();
  req.getContext = <T>(key: string) => {
    const context = req.contextStorage.get(key);

    if (!context)
      throw new Error(`key ${key} doest not exist in request context`);

    return context as T;
  };

  req.setContext = <T>(key: string, value: T) =>
    req.contextStorage.set(key, value);

  return next();
};
