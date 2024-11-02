import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from 'src/user/user.module';
import { EnvService } from 'src/environment/env.service';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenRepositoryAbstract } from './abstract/refresh-token-repository.abstract';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { AuthServiceAbstract } from './abstract/auth-service.abstract';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AbstractTokenService } from './abstract/token-service.abstract';
import { TokenService } from './services/token.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtSecret,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    {
      provide: RefreshTokenRepositoryAbstract,
      useClass: RefreshTokenRepository,
    },
    {
      provide: AuthServiceAbstract,
      useClass: AuthService,
    },
    {
      provide: AbstractTokenService,
      useClass: TokenService,
    },
    JwtStrategy,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthServiceAbstract],
})
export class AuthModule {}
