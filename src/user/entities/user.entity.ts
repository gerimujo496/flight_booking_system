import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';

import { Country } from '../../types/country';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 20)
  first_name: string;

  @Column()
  @Length(1, 20)
  last_name: string;

  @Column()
  @Length(10, 50)
  email: string;

  @Column()
  @Length(8, 20)
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: 'enum', enum: Country, default: Country.UNKNOWN })
  country: Country;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
