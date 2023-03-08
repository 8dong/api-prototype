import { Injectable, NestInterceptor } from '@nestjs/common'
import { ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, map } from 'rxjs'

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => ({ success: true, data })))
  }
}
