import {
  UnauthorizedException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { UserPayloadDTO } from 'src/auth/dto/user-payload.dto';
import { ClsNameSpace } from 'src/common/enums/cls.enums';
import { EnvService } from 'src/environment/env.service';
// import { CompanyService } from '../company/company.service'; // Service to verify user-company association
@Injectable()
export class CompanyContextService {
  constructor(
    private readonly envservice: EnvService,
    private readonly cls: ClsService,

    // private readonly companyService: CompanyService, // Inject CompanyService if verifying association
  ) { }

  /**
   * Retrieves the company ID associated with the current user.
   * @returns {string} The company UUID.
   * @throws {UnauthorizedException} If the user is not authenticated.
   * @throws {ForbiddenException} If the user is not associated with any company or fails association checks.
   */
  getUserCompanyId(): string {
    if (this.envservice.isDevelopment) {
      return '301242a8-e694-4666-8680-9a7e88f70fdf';
    }
    const user: UserPayloadDTO = this.cls.get(ClsNameSpace.USER);

    // 1. Validate User Authentication
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // 2. Ensure `companyId` Exists
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException('User is not associated with any company');
    }

    // 3. Optionally Verify User's Association with the Company
    // Uncomment and implement the following block if you have a CompanyService to verify associations.
    /*
    const isAssociated = this.companyService.isUserInCompany(user.id, companyId);
    if (!isAssociated) {
      throw new ForbiddenException('User is not part of the specified company');
    }
    */

    return companyId;
  }
}
