import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserServiceAbstract } from 'src/user/abstract/user-service.abstract';
import * as bcrypt from 'bcrypt';
import {
  AuthServiceAbstract,
  IAuthTokenResponse,
} from '../abstract/auth-service.abstract';
import { AbstractLoggerService } from 'src/logger/logger-service.abstract';
import { AbstractTokenService } from '../abstract/token-service.abstract';

@Injectable()
export class AuthService implements AuthServiceAbstract {
  constructor(
    private readonly userService: UserServiceAbstract,
    private readonly tokenService: AbstractTokenService,
    private readonly logger: AbstractLoggerService,
  ) { }

  /**
   * Signs in a user with the given username and password.
   * @param username - The username of the user.
   * @param pass - The password of the user.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   * @throws UnauthorizedException - If the credentials are invalid.
   */
  async signIn(email: string, pass: string): Promise<IAuthTokenResponse> {
    this.logger.log(`Sign in attempt for email: ${email}`);
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.is_active) {
      throw new ForbiddenException('User is not active');
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      this.logger.warning(`Invalid credentials for username: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.tokenService.revokeAllTokensByUserId(user.id);
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    this.logger.log(`User ${email} signed in successfully`);
    return { accessToken, refreshToken };
  }

  /**
   * Logs out the given user, revoking their refresh tokens.
   * @param user - The user to log out.
   * @returns A promise that resolves when the user has been logged out.
   */
  async logout(userId: string): Promise<void> {
    this.logger.log(`Logout attempt for user ID: ${userId}`);
    await this.tokenService.revokeAllTokensByUserId(userId);
    this.logger.log(`User ID: ${userId} logged out successfully`);
  }

  /**
   * Refreshes the access and refresh tokens for a user.
   *
   * This method validates the provided refresh token, fetches the associated user,
   * revokes the old refresh token, and generates new access and refresh tokens.
   *
   * @param refreshToken - The refresh token to validate and use for token refresh.
   * @returns A promise that resolves to an object containing the new access and refresh tokens.
   * @throws {UnauthorizedException} If the refresh token is invalid or the user is not found.
   */
  async refreshTokens(refreshToken: string): Promise<IAuthTokenResponse> {
    // Validate the refresh token
    const validatedToken =
      await this.tokenService.validateRefreshToken(refreshToken);
    if (!validatedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Fetch the user based on the token's payload
    const user = await this.userService.getEntityById(validatedToken.sub);
    if (!user.is_active) {
      throw new ForbiddenException('User is not active');
    }
    // Revoke the old refresh token
    await this.tokenService.revokeAllTokensByUserId(user.id);

    // Generate new tokens
    const newAccessToken = await this.tokenService.createAccessToken(user);
    const newRefreshToken = await this.tokenService.createRefreshToken(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
