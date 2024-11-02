import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenRepositoryAbstract } from '../abstract/refresh-token-repository.abstract';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends RefreshTokenRepositoryAbstract {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {
    super();
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    return this.repository.save(refreshToken);
  }

  async findOneByToken(token: string): Promise<RefreshToken | null> {
    return this.repository.findOne({
      where: { token, is_revoked: false },
      relations: ['user'],
    });
  }

  async revokeAllTokensByUserId(userId: string): Promise<void> {
    await this.repository.update({ user_id: userId }, { is_revoked: true });
  }
}
