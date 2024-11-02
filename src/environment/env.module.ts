import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import { validationSchema } from './validation-schema.joi';
import { EnvironmentConsts } from './consts/environment.consts';
import { Environment } from 'src/common/global.enums';

const ENV = process.env.NODE_ENV || 'development';

function envFilePath(): string {
  switch (ENV) {
    case Environment.PRODUCTION:
      return EnvironmentConsts.PRODUCTION_ENV_FILE_PATH;
    default:
      return `.env.${ENV}`;
  }
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath(),
      validationSchema,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
