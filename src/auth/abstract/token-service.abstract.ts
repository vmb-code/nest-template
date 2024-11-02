import { User } from 'src/user/entities/user.entity';

export abstract class AbstractTokenService {
  abstract createRefreshToken(user: User): Promise<string>;
  abstract createAccessToken(user: User): Promise<string>;
  abstract validateRefreshToken(token: string): Promise<{ sub: string } | null>;
  abstract revokeAllTokensByUserId(userId: string): Promise<void>;
}
