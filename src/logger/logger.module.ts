import { Global, Module } from "@nestjs/common";
import { AbstractLoggerService } from "./logger-service.abstract";
import { LoggerService } from "./logger.service";

@Global()
@Module({
  providers: [
    {
      provide: AbstractLoggerService,
      useClass: LoggerService,
    },
  ],
  exports: [AbstractLoggerService],
})
export class LoggerModule {}
