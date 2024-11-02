import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DB_SCHEMAS } from 'src/database';
import { IsEmail, Length } from 'class-validator';
import { BaseEntity } from 'src/common/typeorm/base.entity';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Company } from 'src/company/entities/company.entity';
import { UserRole } from 'src/common/global.enums';

@Entity({ schema: DB_SCHEMAS.USER })
export class User extends BaseEntity {
  @Column({ type: 'boolean', default: false })
  is_active!: boolean;

  @IsEmail()
  @Column({ unique: true })
  email!: string;

  @Length(4, 20)
  @Column()
  password!: string;

  @Column({ type: 'varchar', length: 255 })
  first_name!: string;

  @Column({ type: 'varchar', length: 255 })
  last_name!: string;

  @Column({ type: 'varchar', length: 255 })
  phone_number!: string;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'company_id' })
  company!: Company; // Each user belongs to one company

  @Column({ type: 'uuid' })
  company_id!: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  refresh_tokens!: RefreshToken[];

  @Column({ type: 'varchar', nullable: true, length: 255 })
  reset_token!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reset_token_expiry!: Date | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role!: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
