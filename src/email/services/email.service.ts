import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailConfig } from 'src/common/interfaces/email-config.interface';
import { EnvService } from 'src/environment/env.service';
import { EmailServiceAbstract } from '../abstract/email-service.abstract';
import { SendEmailDTO } from '../dto/send-email.dto';
import { SendOTPDTO } from '../dto/send-otp.dto';
import { SendPasswordRecoveryDTO } from '../dto/send-password-recovery.dto';
import { AbstractLoggerService } from 'src/logger/logger-service.abstract';

@Injectable()
export class EmailService implements EmailServiceAbstract {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(
    private envService: EnvService,
    private readonly logger: AbstractLoggerService,
  ) {
    const emailConfig: EmailConfig = this.envService.emailConfig;
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
      tls: {
        rejectUnauthorized: false, // Optional, to bypass certificate validation
      },
      debug: true, // Enable debug output
      logger: true, // Log information to the console
    });
    this.from = emailConfig.from;
  }

  async sendMail(sendEmailDTO: SendEmailDTO): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.from,
      to: sendEmailDTO.to,
      subject: sendEmailDTO.subject,
      text: sendEmailDTO.text,
      html: sendEmailDTO.html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${sendEmailDTO.to}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send email to ${sendEmailDTO.to}: ${error.message}`,
      );
      throw new Error(
        `Failed to send email to ${sendEmailDTO.to}: ${error.message}`,
      );
    }
  }

  async sendOTP(sendOTPDTO: SendOTPDTO): Promise<void> {
    const sendEmailDTO = this.createSendEmailDTO(
      sendOTPDTO.email,
      'Your OTP Code',
      `Your OTP code is ${sendOTPDTO.otp}`,
      `<p>Your OTP code is <strong>${sendOTPDTO.otp}</strong></p>`,
    );
    await this.sendMail(sendEmailDTO);
  }

  async sendPasswordRecovery(
    sendPasswordRecoveryDTO: SendPasswordRecoveryDTO,
  ): Promise<void> {
    const resetLink = `${this.envService.clientURL}/user/reset-password?token=${sendPasswordRecoveryDTO.token}`;
    const sendEmailDTO = this.createSendEmailDTO(
      sendPasswordRecoveryDTO.email,
      'Password Recovery',
      `Please use the following link to reset your password: ${sendPasswordRecoveryDTO.token}`,
      `<p>Please use the following link to reset your password: <a href="${resetLink}">${sendPasswordRecoveryDTO.token}</a></p>`,
    );
    await this.sendMail(sendEmailDTO);
  }

  private createSendEmailDTO(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): SendEmailDTO {
    const sendEmailDTO = new SendEmailDTO();
    sendEmailDTO.to = to;
    sendEmailDTO.subject = subject;
    sendEmailDTO.text = text;
    sendEmailDTO.html = html;
    return sendEmailDTO;
  }
}
