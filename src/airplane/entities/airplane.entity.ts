import { Length, Max, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Flight } from 'src/flight/entities/flight.entity';

@Entity()
export class Airplane {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 20)
  name: string;

  @Column()
  @Max(500)
  @Min(100)
  num_of_seats: number;

  @OneToMany(() => Flight, (flight) => flight.airplane_id)
  flights: Flight[];

  @Column({ default: true })
  is_active: boolean;

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
