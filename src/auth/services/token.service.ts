import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AbstractTokenService } from '../abstract/token-service.abstract';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/environment/env.service';
import { RefreshToken } from '../entities/refresh-token.entity';
import { AbstractLoggerService } from 'src/logger/logger-service.abstract';
import { RefreshTokenRepositoryAbstract } from '../abstract/refresh-token-repository.abstract';
import { addMinutes, minutesToSeconds } from 'date-fns';
import { TOKEN_EXPIRY } from '../consts/auth.consts';
import { UserPayloadDTO } from '../dto/user-payload.dto';
import { CompanyContextService } from 'src/shared';

@Injectable()
export class TokenService implements AbstractTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly logger: AbstractLoggerService,
    private readonly refreshTokenRepository: RefreshTokenRepositoryAbstract,
    private readonly companyContextService: CompanyContextService,
  ) { }

  public async createRefreshToken(user: User): Promise<string> {
    const companyId = this.companyContextService.getUserCompanyId();
    this.logger.log(`Creating refresh token for user ID: ${user.id}`);
    const tokenPayload = {
      sub: user.id,
    };

    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.token = await this.jwtService.signAsync(tokenPayload, {
      secret: this.envService.refreshTokenSecret,
      expiresIn: minutesToSeconds(TOKEN_EXPIRY.REFRESH_TOKEN_MINUTES),
    });
    refreshToken.expiry_date = addMinutes(
      new Date(),
      TOKEN_EXPIRY.REFRESH_TOKEN_MINUTES,
    );
    refreshToken.is_revoked = false;
    refreshToken.company_id = companyId;

    const savedToken = await this.refreshTokenRepository.save(refreshToken);
    this.logger.log(`Refresh token created for user ID: ${user.id}`);
    return savedToken.token;
  }

  public async revokeAllTokensByUserId(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllTokensByUserId(userId);
  }

  public async createAccessToken(user: User): Promise<string> {
    const payload = this.mapUserToPayload(user);
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.envService.accessTokenSecret,
      expiresIn: minutesToSeconds(TOKEN_EXPIRY.ACCESS_TOKEN_MINUTES),
    });
    return accessToken;
  }

  public async validateRefreshToken(
    token: string,
  ): Promise<{ sub: string } | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.envService.refreshTokenSecret,
      });

      const storedToken =
        await this.refreshTokenRepository.findOneByToken(token);
      if (
        !storedToken ||
        storedToken.is_revoked ||
        storedToken.expiry_date <= new Date()
      ) {
        this.logger.warning('Invalid or expired refresh token');
        throw new UnauthorizedException('Invalid token');
      }

      return { sub: payload.sub };
    } catch (error) {
      this.logger.error('Error validating refresh token', error);
      return null;
    }
  }

  private mapUserToPayload(user: User): UserPayloadDTO {
    return {
      sub: user.id,
      email: user.email,
      companyId: user.company_id,
      role: user.role,
    };
  }
}
