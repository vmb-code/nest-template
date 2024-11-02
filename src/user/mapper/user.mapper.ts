import { User } from '../entities/user.entity';
import { UserDTO } from '../dto/user.dto';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserOverviewDTO } from '../dto/user-overview.dto';
import { UserRole } from 'src/common/global.enums';

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      role: user.role,
      isActive: user.is_active,
    };
  }

  static toOverviewDTO(entity: User): UserOverviewDTO {
    return {
      id: entity.id,
      email: entity.email,
      fullName: `${entity.first_name} ${entity.last_name}`,
      phoneNumber: entity.phone_number,
      roleLabel: UserMapper.mapRoleToLabel(entity.role),
      isActive: entity.is_active ? 'Yes' : 'No',
    };
  }

  static toEntity(dto: CreateUserDTO): User {
    const user = new User();
    user.email = dto.email;
    user.password = dto.password; // Password is hashed before saving
    user.first_name = dto.firstName;
    user.last_name = dto.lastName;
    user.phone_number = dto.phoneNumber;
    user.role = dto.role;
    user.is_active = dto.isActive;

    return user;
  }

  static updateEntity(dto: UpdateUserDTO, existingEntity: User): User {
    existingEntity.email = dto.email ?? existingEntity.email;
    existingEntity.first_name = dto.firstName ?? existingEntity.first_name;
    existingEntity.last_name = dto.lastName ?? existingEntity.last_name;
    existingEntity.phone_number =
      dto.phoneNumber ?? existingEntity.phone_number;

    existingEntity.is_active = dto.isActive ?? existingEntity.is_active;

    return existingEntity;
  }

  static mapRoleToLabel(role: UserRole): string {
    switch (role) {
      case UserRole.NORMAL:
        return 'Normal User';
      case UserRole.CUSTOMER_ADMIN:
        return 'Customer Admin';
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      default:
        return 'Unknown Role';
    }
  }
}
