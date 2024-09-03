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
  departure_country: Country;

  @Column({ type: 'enum', enum: Airport })
  departure_airport: Airport;

  @Column()
  @MinDate(new Date())
  departure_time: Date;

  @Column({ type: 'enum', enum: Country, default: Country.UNKNOWN })
  arrival_country: Country;

  @Column({ type: 'enum', enum: Airport })
  arrival_airport: Airport;

  @Column()
  @MinDate(new Date())
  arrival_time: Date;

  @ManyToOne(() => Airplane, (airplane) => airplane.id)
  airplane_id: number;

  @Column()
  @Min(4000)
  @Max(10000)
  price: number;

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
