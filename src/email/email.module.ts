import { Module } from '@nestjs/common';
import { EmailServiceAbstract } from './abstract/email-service.abstract';
import { EmailService } from './services/email.service';

@Module({
  imports: [],
  providers: [{ provide: EmailServiceAbstract, useClass: EmailService }],
  controllers: [],
  exports: [EmailServiceAbstract],
})
export class EmailModule {}
