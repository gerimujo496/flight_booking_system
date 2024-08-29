import { Max, Min } from 'class-validator';
import { Airplane } from 'src/airplane/entities/airplane.entity';
import { Flight } from 'src/flight/entities/flight.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BookingSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  userId: number;

  @ManyToOne(() => Flight, (flight) => flight.id)
  flightId: number;

  @ManyToOne(() => Airplane, (airplane) => airplane.id)
  airplaneId: number;

  @Column()
  @Max(500)
  seatNumber: number;

  @Column()
  @Min(4000)
  @Max(10000)
  price: number;

  @Column({ default: null })
  isApproved: boolean;

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
