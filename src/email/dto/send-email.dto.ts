export class SendEmailDTO {
  to!: string;
  subject!: string;
  text!: string;
  html?: string;
}
