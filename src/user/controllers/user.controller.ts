import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common';
import { UserServiceAbstract } from '../abstract/user-service.abstract';
import { CreateUserDTO } from '../dto/create-user.dto';
import { RequestPasswordResetDTO } from '../dto/request-password-reset.dto';
import { ResetPasswordDTO } from '../dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/consts/auth.consts';
import {
  GetAllUsersSwagger,
  GetUserByIdSwagger,
  CreateUserSwagger,
  RequestPasswordResetSwagger,
  ResetPasswordSwagger,
  UpdateUserSwagger,
  UpdatePasswordSwagger,
} from '../decorators/user-swagger.decorators';
import { UserDTO } from '../dto/user.dto';
import { UserOverviewDTO } from '../dto/user-overview.dto';
import { CompanyIdParam } from 'src/common/params/id.param';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UpdatePasswordDTO } from '../dto/update-password.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { UserPayloadDTO } from 'src/auth/dto/user-payload.dto';
import { CompanyAccessGuard } from 'src/auth/guards/company-access.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserServiceAbstract) {}

  // @UseGuards(SuperAdminOrCustomerAdminGuard)
  @Post('company/:companyId')
  @CreateUserSwagger()
  @Public()
  async createUser(
    @Param() { companyId }: CompanyIdParam,
    @Body() userData: CreateUserDTO,
  ): Promise<UserDTO> {
    return this.userService.createUser(userData, companyId);
  }

  @UseGuards(CompanyAccessGuard)
  @Put('company/:companyId')
  @UpdateUserSwagger()
  async updateUser(@Body() userData: UpdateUserDTO): Promise<UserDTO> {
    return this.userService.updateUser(userData);
  }

  @Get('id/:id')
  @Public()
  @GetUserByIdSwagger()
  async getUserById(@Param('id') id: string): Promise<UserDTO> {
    const user = await this.userService.getById(id);
    return user;
  }

  @UseGuards(CompanyAccessGuard)
  @Get('company/:companyId')
  @GetAllUsersSwagger()
  async getAllUsersByCompanyId(
    @Param() { companyId }: CompanyIdParam,
  ): Promise<UserOverviewDTO[]> {
    return this.userService.getAllUsersByCompanyId(companyId);
  }

  @Public()
  @Post('request-password-reset')
  @RequestPasswordResetSwagger()
  async requestPasswordReset(
    @Body() resetData: RequestPasswordResetDTO,
  ): Promise<void> {
    const { email } = resetData;
    return this.userService.requestPasswordReset(email);
  }

  @Public()
  @Post('reset-password')
  @ResetPasswordSwagger()
  async resetPassword(@Body() resetDTO: ResetPasswordDTO): Promise<void> {
    return this.userService.resetPassword(resetDTO);
  }

  @Put('update-password')
  @UpdatePasswordSwagger()
  async updatePassword(
    @Body() updatePasswordDTO: UpdatePasswordDTO,
    @GetUser() user: UserPayloadDTO,
  ): Promise<void> {
    return this.userService.updatePassword(updatePasswordDTO, user);
  }
}
