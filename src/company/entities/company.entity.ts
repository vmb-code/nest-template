import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { DB_SCHEMAS } from 'src/database';

@Entity({ schema: DB_SCHEMAS.COMPANY, name: 'company' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', default: false })
  active!: boolean;

  @Column({ type: 'varchar', length: 12, unique: true })
  organization_number!: string;

  @Column({ type: 'varchar', length: 255 })
  company_name!: string; // The official name of the company

  @Column({ type: 'varchar', length: 20, nullable: true })
  vat_number!: string | null; // Optional VAT number (Momsregistreringsnummer)

  @Column({ type: 'varchar', length: 255 })
  address!: string; // Registered company address

  @Column({ type: 'varchar', length: 100 })
  city!: string; // City where the company is registered

  @Column({ type: 'varchar', length: 10 })
  postal_code!: string; // Postal code for the company

  @Column({ type: 'varchar', length: 100 })
  country!: string; // Country where the company is located

  @Column({ type: 'varchar', length: 255 })
  email!: string; // Contact email for the company

  @Column({ type: 'varchar', length: 20 })
  phone_number!: string; // Contact phone number for the company

  @Column({ type: 'int' })
  number_of_employees!: number; // Number of employees in the company

  @Column({ type: 'varchar', length: 255, nullable: true })
  website!: string | null; // Optional company website

  @Column({ type: 'varchar', length: 100, nullable: true })
  ceo!: string | null; // Name of the company's CEO, optional

  @Column({ type: 'varchar', length: 100, nullable: true })
  industry!: string | null; // Industry or sector the company operates in

  // One-to-many relationship with users (a company can have many users)
  @OneToMany(() => User, (user) => user.company, {
    cascade: true,
  })
  users?: User[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
