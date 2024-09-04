import { Airplane } from 'src/airplane/entities/airplane.entity';
import { airplanesSeed, flightSeed } from 'src/constants/seed';
import { Flight } from 'src/flight/entities/flight.entity';
import { DataSource } from 'typeorm';

async function truncate(dataSource: DataSource) {
  await dataSource.query('TRUNCATE "booking_seat" RESTART IDENTITY CASCADE;');
  await dataSource.query('TRUNCATE "flight" RESTART IDENTITY CASCADE;');
  await dataSource.query('TRUNCATE "airplane" RESTART IDENTITY CASCADE;');
}

export async function seedData(dataSource: DataSource) {
  await truncate(dataSource);

  const repository = dataSource.getRepository(Airplane);
  const flightRepository = dataSource.getRepository(Flight);

  for (const item of airplanesSeed) {
    await repository.insert(item);
  }
  for (const item of flightSeed) {
    await flightRepository.insert(item);
  }
}
