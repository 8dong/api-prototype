import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { SuccessResponseInterceptor } from './common/interceptors/successResponse.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new SuccessResponseInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(3000)
}
bootstrap()
