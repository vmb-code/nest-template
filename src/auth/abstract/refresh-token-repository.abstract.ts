import { RefreshToken } from '../entities/refresh-token.entity';

export abstract class RefreshTokenRepositoryAbstract {
  /**
   * Saves a refresh token entity to the database.
   * @param refreshToken - The refresh token entity to save.
   * @returns A promise that resolves to the saved refresh token entity.
   */
  abstract save(refreshToken: RefreshToken): Promise<RefreshToken>;

  /**
   * Finds a refresh token entity by its token string.
   * @param token - The token string to search for.
   * @returns A promise that resolves to the refresh token entity, or undefined if not found.
   */
  abstract findOneByToken(token: string): Promise<RefreshToken | null>;

  /**
   * Revokes all refresh tokens for a given user.
   * @param userId - The ID of the user whose tokens will be revoked.
   * @returns A promise that resolves when the operation is complete.
   */
  abstract revokeAllTokensByUserId(userId: string): Promise<void>;
}
