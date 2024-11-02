import { User } from 'src/user/entities/user.entity';
import { UserPayloadDTO } from '../dto/user-payload.dto';

export interface IAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class AuthServiceAbstract {
  /**
   * Signs in a user with the given username and password.
   * @param username - The username of the user.
   * @param pass - The password of the user.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   */
  public abstract signIn(
    username: string,
    pass: string,
  ): Promise<IAuthTokenResponse>;

  /**
   * Logs out the given user, revoking their refresh tokens.
   * @param user - The user to log out.
   * @returns A promise that resolves when the user has been logged out.
   */
  public abstract logout(userId: string): Promise<void>;

  /**
   * Refreshes the access and refresh tokens for the given user.
   * @param refreshToken - The refresh token to refresh.
   * @returns A promise that resolves to an object containing the new access token and refresh token.
   */
  public abstract refreshTokens(
    refreshToken: string,
  ): Promise<IAuthTokenResponse>;
}
