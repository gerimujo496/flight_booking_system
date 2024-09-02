import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BookingSeat } from 'src/booking-seat/entities/booking-seat.entity';

@Injectable()
export class AdminOrEntityOwnerGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      return false;
    }
    const { id, isAdmin, body, method } = this.getRequestProperties(request);

    if (isAdmin) return true;

    const paths: string[] = request.path.split('/');
    if (paths.length < 2) return false;

    const path = paths[1];
    const secondPath = paths[2];

    if (path === `user` && secondPath == id) return true;

    if (
      path == `booking-seat` &&
      (secondPath == 'bookPreferredSeat' || secondPath == 'bookRandomSeat') &&
      method == 'POST' &&
      id == body.userId
    )
      return true;

    if (path == 'booking-seat' && !isNaN(+secondPath) && method == 'GET') {
      const booking = await this.dataSource
        .getRepository(BookingSeat)
        .createQueryBuilder('booking_seat')
        .leftJoinAndSelect('booking_seat.user_id', 'user')
        .where('booking_seat.id = :id', { id: secondPath })
        .getOne();

      if (booking.user_id['id'] == id) return true;
      return false;
    }
    false;
  }

  getRequestProperties(request: any) {
    const { id, isAdmin } = request.currentUser;
    const { body } = request;
    const { method } = request;

    return { id, isAdmin, body, method };
  }
}
