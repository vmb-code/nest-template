import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from './database.consts';
import { EnvService } from 'src/environment/env.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (envService: EnvService) => {
        return {
          type: 'postgres',
          host: envService.dbHost,
          port: envService.dbPort,
          username: envService.dbUser,
          password: envService.dbPassword,
          database: envService.dbName,
          entities: ENTITIES,
          synchronize: envService.isDevelopment,
        };
      },
      inject: [EnvService],
    }),
  ],
})
export class DatabaseModule {}
