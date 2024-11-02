import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database";
import { EnvModule } from "./environment/env.module";
import { UserModule } from "./user/user.module";
import { LoggerModule } from "./logger/logger.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { CompanyModule } from "./company/company.module";
import { SharedModule } from "./shared";
import { ClsModule } from "nestjs-cls";

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    DatabaseModule,
    EnvModule,
    UserModule,
    CompanyModule,
    LoggerModule,
    AuthModule,
    EmailModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
