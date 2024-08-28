import { Max, Min, MinDate } from 'class-validator';
import { Airplane } from 'src/airplane/entities/airplane.entity';
import { Airport } from 'src/types/airports';
import { Country } from 'src/types/country';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Country, default: Country.UNKNOWN })
  departureCountry: Country;

  @Column({ type: 'enum', enum: Airport })
  departureAirport: Airport;

  @Column()
  @MinDate(new Date())
  departureTime: Date;

  @Column({ type: 'enum', enum: Country, default: Country.UNKNOWN })
  arrivalCountry: Country;

  @Column({ type: 'enum', enum: Airport })
  arrivalAirport: Airport;

  @Column()
  @MinDate(new Date())
  arrivalTime: Date;

  @ManyToOne(() => Airplane, (airplane) => airplane.id)
  airplaneId: number;

  @Column()
  @Min(4000)
  @Max(10000)
  price: number;

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
