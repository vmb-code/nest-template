import { Response, Request, CookieOptions } from 'express';
import { CookieName } from '../enums/cookie.enum';

export class CookieHelper {
  private static getCookieOptions(
    isDevelopment: boolean,
    maxAge?: number,
  ): CookieOptions {
    const options: CookieOptions = {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: 'strict',
      domain: process.env.DOMAIN,
    };

    if (maxAge) {
      options.maxAge = maxAge;
    }

    return options;
  }

  static setCookie(
    res: Response,
    name: string,
    value: string,
    isDevelopment: boolean,
    maxAge?: number,
  ) {
    const options = this.getCookieOptions(isDevelopment, maxAge);
    res.cookie(name, value, options);
  }

  static clearCookie(
    res: Response,
    name: string,
    isDevelopment: boolean,
  ): void {
    const options = {
      ...this.getCookieOptions(isDevelopment),
      expires: new Date(0), // Expire immediately to remove the cookie
    };
    res.cookie(name, '', options);
  }

  /**
   * Extracts the specified cookie from the request based on CookieNames enum.
   * @param req - The Express request object.
   * @param cookieName - The name of the cookie from the CookieNames enum.
   * @returns The value of the cookie or undefined if not found.
   */
  static getCookie(req: Request, cookieName: CookieName): string | undefined {
    return req.cookies?.[cookieName];
  }
}
