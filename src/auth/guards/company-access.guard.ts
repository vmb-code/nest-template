import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/common/global.enums';
import { UserServiceAbstract } from 'src/user/abstract/user-service.abstract';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private readonly userService: UserServiceAbstract) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.user.sub;
    const companyId = request.params.companyId;

    if (!userId) {
      return false;
    }
    const user = await this.userService.getEntityById(userId);

    if (!user || !user.is_active) {
      return false;
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!companyId) {
      return false;
    }

    if (user.role === UserRole.CUSTOMER_ADMIN) {
      return companyId === user.company.id;
    }

    return false;
  }
}
