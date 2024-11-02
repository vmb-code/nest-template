import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { validateDTO } from 'src/common/utils/validate.utils';
import { EnvService } from 'src/environment/env.service';
import { UserPayloadDTO } from '../dto/user-payload.dto';
import { ClsService } from 'nestjs-cls';
import { ClsNameSpace } from 'src/common/enums/cls.enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly envService: EnvService,
    private readonly cls: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: envService.accessTokenSecret,
    });
  }

  async validate(payload: any): Promise<UserPayloadDTO> {
    const validatedPayload = await validateDTO(UserPayloadDTO, payload);

    const returnPayload = {
      sub: validatedPayload.sub,
      email: validatedPayload.email,
      companyId: validatedPayload.companyId,
      role: validatedPayload.role,
    };

    this.cls.set(ClsNameSpace.USER, returnPayload);

    return returnPayload;
  }
}
