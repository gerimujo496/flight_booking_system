import { Max, Min } from 'class-validator';
import { Airplane } from 'src/airplane/entities/airplane.entity';
import { Flight } from 'src/flight/entities/flight.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BookingSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user_id: number;

  @ManyToOne(() => Flight, (flight) => flight.id)
  flight_id: number;

  @ManyToOne(() => Airplane, (airplane) => airplane.id)
  airplane_id: number;

  @Column()
  @Max(500)
  seat_number: number;

  @ManyToOne(() => Flight, (flight) => flight.id, { nullable: true })
  return_flight_id: number;

  @ManyToOne(() => Airplane, (airplane) => airplane.id)
  return_airplane_id: number;

  @Column({ nullable: true })
  return_seat_number: number;

  @Column()
  @Min(4000)
  @Max(10000)
  price: number;

  @Column({ default: null })
  is_approved: boolean;

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
