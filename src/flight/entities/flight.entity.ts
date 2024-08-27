import { Min, MinDate } from 'class-validator';
import { Airplane } from 'src/airplane/entities/airplane.entity';
import { Airport } from 'src/types/airports';
import { Country } from 'src/types/country';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Country, default: Country.UNKNOWN })
  departureCountry: Country;

  @Column({ type: 'enum', enum: Country, default: Airport.BEIJING_CAPITAL })
  departureAirport: Airport;

  @Column()
  @MinDate(new Date())
  departureTime: Date;

  @Column({ type: 'enum', enum: Country, default: Country.UNKNOWN })
  arrivalCountry: Country;

  @Column({ type: 'enum', enum: Country, default: Airport.BEIJING_CAPITAL })
  arrivalAirport: Airport;

  @Column()
  @MinDate(new Date())
  arrivalTime: Date;

  @ManyToOne(() => Airplane, (airplane) => airplane.id)
  airplaneId: number;

  @Column()
  @Min(0)
  price: number;
}
