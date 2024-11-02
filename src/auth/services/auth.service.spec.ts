import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/environment/env.service';
import { UserServiceAbstract } from 'src/user/abstract/user-service.abstract';
import { RefreshTokenRepositoryAbstract } from '../abstract/refresh-token-repository.abstract';
import { AbstractLoggerService } from 'src/logger/logger-service.abstract';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserServiceAbstract;
  let jwtService: JwtService;
  let refreshTokenRepository: RefreshTokenRepositoryAbstract;
  let logger: AbstractLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserServiceAbstract,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: EnvService,
          useValue: {
            accessTokenSecret: 'test_secret',
            refreshTokenSecret: 'test_refresh_secret',
          },
        },
        {
          provide: RefreshTokenRepositoryAbstract,
          useValue: {
            findOneByToken: jest.fn(),
            save: jest.fn(),
            updateIsRevoked: jest.fn(),
          },
        },
        {
          provide: AbstractLoggerService,
          useValue: {
            log: jest.fn(),
            warning: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserServiceAbstract>(UserServiceAbstract);
    jwtService = module.get<JwtService>(JwtService);
    refreshTokenRepository = module.get<RefreshTokenRepositoryAbstract>(
      RefreshTokenRepositoryAbstract,
    );
    logger = module.get<AbstractLoggerService>(AbstractLoggerService);
  });

  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      const username = 'testuser';
      const password = 'testpass';
      const user: User = {
        id: 'test',
        username: 'testuser',
        password: 'hashedpass',
        email: 'testuser@example.com',
        refreshTokens: [],
        hashPassword: jest.fn(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValueOnce(true as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('access_token');
      const refreshTokenSpy = jest
        .spyOn<any, any>(authService as any, 'createRefreshToken')
        .mockResolvedValueOnce({ token: 'refresh_token' } as RefreshToken);

      const result = await authService.signIn(username, password);

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(logger.log).toHaveBeenCalledWith(
        `Sign in attempt for username: ${username}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `User ${username} signed in successfully`,
      );
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const username = 'testuser';
      const password = 'wrongpass';
      const user: User = {
        id: 'test',
        username: 'testuser',
        password: 'hashedpass',
        email: 'testuser@example.com',
        refreshTokens: [],
        hashPassword: jest.fn(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValueOnce(false as any);

      await expect(authService.signIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(logger.warning).toHaveBeenCalledWith(
        `Invalid credentials for username: ${username}`,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens with a valid refresh token', async () => {
      const oldToken = 'old_refresh_token';
      const user: User = {
        id: 'test',
        username: 'testuser',
        password: 'hashedpass',
        email: 'testuser@example.com',
        refreshTokens: [],
        hashPassword: jest.fn(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      const oldRefreshToken = {
        token: oldToken,
        expiryDate: new Date(Date.now() + 10000),
        isRevoked: false,
        user,
      } as RefreshToken;

      jest
        .spyOn(refreshTokenRepository, 'findOneByToken')
        .mockResolvedValueOnce(oldRefreshToken);
      jest
        .spyOn<any, any>(authService as any, 'createRefreshToken')
        .mockResolvedValueOnce({ token: 'new_refresh_token' } as RefreshToken);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('new_access_token');

      const result = await authService.refreshToken(oldToken);

      expect(result).toEqual({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      });
      expect(refreshTokenRepository.save).toHaveBeenCalledWith({
        ...oldRefreshToken,
        isRevoked: true,
      });
      expect(logger.log).toHaveBeenCalledWith('Refresh token attempt');
      expect(logger.log).toHaveBeenCalledWith(
        'Refresh token created successfully',
      );
    });

    it('should throw an UnauthorizedException if the refresh token is invalid or expired', async () => {
      const oldToken = 'invalid_refresh_token';

      jest
        .spyOn(refreshTokenRepository, 'findOneByToken')
        .mockResolvedValueOnce(null);

      await expect(authService.refreshToken(oldToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(logger.warning).toHaveBeenCalledWith(
        'Invalid or expired refresh token',
      );
    });
  });

  describe('logout', () => {
    it('should revoke all refresh tokens for the user', async () => {
      const user: User = {
        id: 'test',
        username: 'testuser',
        password: 'hashedpass',
        email: 'testuser@example.com',
        refreshTokens: [],
        hashPassword: jest.fn(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      await authService.logout(user);

      expect(refreshTokenRepository.updateIsRevoked).toHaveBeenCalledWith(
        user.id,
        true,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Logout attempt for user ID: ${user.id}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `User ID: ${user.id} logged out successfully`,
      );
    });
  });

  describe('createRefreshToken', () => {
    it('should create a new refresh token for the user', async () => {
      const user: User = {
        id: 'test',
        username: 'testuser',
        password: 'hashedpass',
        email: 'testuser@example.com',
        refreshTokens: [],
        hashPassword: jest.fn(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('new_refresh_token');
      jest.spyOn(refreshTokenRepository, 'save').mockResolvedValueOnce({
        token: 'new_refresh_token',
        user,
      } as RefreshToken);

      const result = await (authService as any).createRefreshToken(user);

      expect(result.token).toBe('new_refresh_token');
      expect(refreshTokenRepository.save).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        `Creating refresh token for user ID: ${user.id}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Refresh token created for user ID: ${user.id}`,
      );
    });
  });
});
