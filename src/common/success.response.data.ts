import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  // response: T;
  data: any;
}

@Injectable()
export class SuccessResponseData<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const checkArrayOrObj = (value) => {
      console.log(value, 'ini value checkobj array');

      if (Array.isArray(value)) {
        return value;
      }
      return { ...value };
    };
    return next.handle().pipe(
      map((data) => ({
        status: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data.message || 'Success Retrieve Data',
        data: checkArrayOrObj(data.result),
      })),
    );
  }
}
