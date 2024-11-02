export abstract class AbstractLoggerService {
  abstract log(message: string, meta?: any): void;
  abstract warning(message: string, meta?: any): void;
  abstract error(message: string, meta?: any): void;
}
