import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse()
    const statusCode = exception.getStatus()
    const message = exception.getResponse() as
      | string
      | { statusCode: number; message: string; error: string }

    if (typeof message === 'string') {
      return response.status(statusCode).json({
        success: false,
        statusCode,
        message
      })
    } else {
      return response.status(statusCode).json({
        success: false,
        ...message
      })
    }
  }
}
