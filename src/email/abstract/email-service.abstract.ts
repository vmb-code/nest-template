import { SendEmailDTO } from '../dto/send-email.dto';
import { SendOTPDTO } from '../dto/send-otp.dto';
import { SendPasswordRecoveryDTO } from '../dto/send-password-recovery.dto';

export abstract class EmailServiceAbstract {
  public abstract sendMail(sendEmailDTO: SendEmailDTO): Promise<void>;
  public abstract sendOTP(sendOTPDTO: SendOTPDTO): Promise<void>;
  public abstract sendPasswordRecovery(
    sendPasswordRecoveryDTO: SendPasswordRecoveryDTO,
  ): Promise<void>;
}
