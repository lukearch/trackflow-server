import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { JSON_IGNORED_PROPS } from '@/common/decorators/ignore.decorator';

@Injectable()
export class IgnorePropertiesInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        const ignoredProperties = this.extractIgnoredProps(context);

        ignoredProperties?.map((prop) => this.removeProp(prop, res));

        return res;
      })
    );
  }

  public extractIgnoredProps(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<string[]>(JSON_IGNORED_PROPS, [
      context.getHandler(),
      context.getClass()
    ]);
  }

  private removeProp(prop: string, obj: any) {
    if (!obj) return;

    const shouldSplit = prop.includes('.');

    if (!shouldSplit) {
      delete obj[prop];
      return;
    }

    const splited = prop.split('.');
    const firstProp = splited.shift();

    this.removeProp(splited.join('.'), obj[firstProp]);
  }
}
