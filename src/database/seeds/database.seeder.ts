// // src/db/seeds/user.seeder.ts
// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { DataSource } from 'typeorm';
// import { Airplane } from 'src/airplane/entities/airplane.entity';

import { Airplane } from 'src/airplane/entities/airplane.entity';
import { airplanesSeed, flightSeed } from 'src/constants/seed';
import { Flight } from 'src/flight/entities/flight.entity';
import { DataSource } from 'typeorm';

// export default class UserSeeder implements Seeder {
//   public async run(
//     dataSource: DataSource,
//     factoryManager: SeederFactoryManager,
//   ): Promise<void> {
//     await dataSource.query('TRUNCATE "airplane" RESTART IDENTITY;');

//     const repository = dataSource.getRepository(Airplane);
//     await repository.insert({
//       name: 'Boeing 737',
//       num_of_seats: 150,
//     });
//     await repository.insert({
//       name: 'Airbus A320',
//       num_of_seats: 180,
//     });
//     await repository.insert({
//       name: 'Boeing 777',
//       num_of_seats: 400,
//     });
//     await repository.insert({
//       name: 'Embraer E190',
//       num_of_seats: 100,
//     });
//     await repository.insert({
//       name: 'McDonnell Douglas MD-80',
//       num_of_seats: 150,
//     });
//     await repository.insert({
//       name: 'Airbus A350-1000',
//       num_of_seats: 350,
//     });
//   }
// }
async function truncate(dataSource: DataSource) {
  await dataSource.query('TRUNCATE "booking_seat" RESTART IDENTITY CASCADE;');
  await dataSource.query('TRUNCATE "flight" RESTART IDENTITY CASCADE;');
  await dataSource.query('TRUNCATE "airplane" RESTART IDENTITY CASCADE;');
  await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');
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
