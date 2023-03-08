import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { SuccessResponseInterceptor } from './common/interceptors/successResponse.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new SuccessResponseInterceptor())
  await app.listen(3000)
}
bootstrap()
