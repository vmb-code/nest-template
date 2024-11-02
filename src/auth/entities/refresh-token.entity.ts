import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DB_SCHEMAS } from 'src/database';
import { BaseEntity } from 'src/common/typeorm/base.entity';

@Entity({ schema: DB_SCHEMAS.AUTH })
export class RefreshToken extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  token!: string;

  @ManyToOne(() => User, (user) => user.refresh_tokens)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ nullable: false })
  user_id!: string;

  @Column({ type: 'timestamptz' })
  expiry_date!: Date;

  @Column({ type: 'boolean', default: false })
  is_revoked!: boolean;
}
