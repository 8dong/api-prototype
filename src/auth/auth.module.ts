import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'

import { UserModule } from './../user/user.module'
import { JwtStrategy } from './jwt/jwt.strategy'
import { AuthService } from './auth.service'

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '1d'
        }
      })
    }),
    forwardRef(() => UserModule)
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
