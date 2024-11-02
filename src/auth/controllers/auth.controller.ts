import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { SignInDTO } from '../dto/sign-in.dto';
import { Public, TOKEN_EXPIRY } from '../consts/auth.consts';
import { EnvService } from 'src/environment/env.service';
import {
  AuthServiceAbstract,
  IAuthTokenResponse,
} from '../abstract/auth-service.abstract';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CookieName } from 'src/common/enums/cookie.enum';
import { CookieHelper } from 'src/common/utils/cookie.utils';
import { minutesToMilliseconds } from 'date-fns';
import { GetUser } from 'src/common/decorators/user.decorator';
import { UserPayloadDTO } from '../dto/user-payload.dto';
import {
  GetCurrentUserSwagger,
  LogoutSwagger,
  RefreshTokenSwagger,
  SignInSwagger,
} from '../decorators/auth-swagger.decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthServiceAbstract,
    private envService: EnvService,
  ) {}

  @SignInSwagger()
  @Public()
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    this.setTokenCookies(res, tokens);
  }

  @LogoutSwagger()
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @GetUser() user: UserPayloadDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);
    CookieHelper.clearCookie(
      res,
      CookieName.ACCESS_TOKEN,
      this.envService.isDevelopment,
    );
    CookieHelper.clearCookie(
      res,
      CookieName.REFRESH_TOKEN,
      this.envService.isDevelopment,
    );
  }

  @RefreshTokenSwagger()
  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    try {
      const refreshToken = CookieHelper.getCookie(
        req,
        CookieName.REFRESH_TOKEN,
      );
      if (!refreshToken) {
        throw new UnauthorizedException();
      }
      const result = await this.authService.refreshTokens(refreshToken);
      this.setTokenCookies(res, result);
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  @GetCurrentUserSwagger()
  @ApiBearerAuth()
  @Get('me')
  public getCurrentUser(@GetUser() user: UserPayloadDTO): UserPayloadDTO {
    return user;
  }

  private setTokenCookies(res: Response, tokens: IAuthTokenResponse): void {
    const isDev = this.envService.isDevelopment;
    CookieHelper.setCookie(
      res,
      CookieName.ACCESS_TOKEN,
      tokens.accessToken,
      isDev,
      minutesToMilliseconds(TOKEN_EXPIRY.ACCESS_TOKEN_MINUTES),
    );
    CookieHelper.setCookie(
      res,
      CookieName.REFRESH_TOKEN,
      tokens.refreshToken,
      isDev,
      minutesToMilliseconds(TOKEN_EXPIRY.REFRESH_TOKEN_MINUTES),
    );
  }
}
