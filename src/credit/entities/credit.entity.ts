import { Min } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Credit {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user_id: User;

  @Column()
  @Min(0)
  credits: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
