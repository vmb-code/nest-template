import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/common/global.enums';
import { EmailConfig } from 'src/common/interfaces/email-config.interface';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  public get httpPort(): number {
    return this.configService.getOrThrow<number>('HTTP_PORT');
  }

  public get clientURL(): string {
    return this.configService.getOrThrow<string>('CLIENT_URL');
  }

  public get dbName(): string {
    return this.configService.getOrThrow<string>('DB_NAME');
  }

  public get dbHost(): string {
    return this.configService.getOrThrow<string>('DB_HOST');
  }

  public get dbPort(): number {
    return this.configService.getOrThrow<number>('DB_PORT');
  }

  public get dbUser(): string {
    return this.configService.getOrThrow<string>('DB_USER');
  }
  public get dbPassword(): string {
    return this.configService.getOrThrow<string>('DB_PASSWORD');
  }

  public get accessTokenSecret(): string {
    return this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET');
  }

  public get refreshTokenSecret(): string {
    return this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET');
  }

  public get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  public get isDevelopment(): boolean {
    return (
      this.configService.getOrThrow<string>('NODE_ENV') ===
      Environment.DEVELOPMENT
    );
  }

  public get emailConfig(): EmailConfig {
    return {
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      secure: this.configService.getOrThrow<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
    };
  }
}
