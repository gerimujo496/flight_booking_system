import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BookingSeat } from 'src/booking-seat/entities/booking-seat.entity';
import { controller } from 'src/constants/controller';
import { controller_path } from 'src/constants/controllerPath';
import { throwError } from 'src/helpers/throwError';
import { errorMessage } from 'src/constants/errorMessages';

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

    if (this.ifUserWeAreAccessingIsCurrentUser({ path, secondPath, id }))
      return true;

    if (
      this.ifBookingIsBeingCreatedByCurrentUser({
        path,
        secondPath,
        method,
        id,
        userId: body.user_id,
      })
    )
      return true;

    if (
      await this.ifBookingIsCreatedByCurrentUser({
        path,
        secondPath,
        method,
        id,
      })
    )
      return true;

    if (this.creditsAreRelatedToCurrentUser(paths, id)) return true;

    return false;
  }
  creditsAreRelatedToCurrentUser(paths: string[], id: string) {
    if (paths[1] != controller.CREDIT) return false;
    if (paths[2] == id || paths[3] == id) return true;
  }

  async ifBookingIsCreatedByCurrentUser({
    path,
    secondPath,
    method,
    id,
  }: {
    path: string;
    secondPath: string;
    method: string;
    id: string;
  }) {
    if (
      path == controller.BOOKING_SEAT &&
      !isNaN(+secondPath) &&
      method == 'GET'
    ) {
      const booking = await this.dataSource
        .getRepository(BookingSeat)
        .createQueryBuilder('booking_seat')
        .leftJoinAndSelect('booking_seat.user_id', 'user')
        .where('booking_seat.id = :id', { id: secondPath })
        .getOne();

      if (!booking)
        throwError(
          HttpStatus.NOT_FOUND,
          errorMessage.NOT_FOUND(`booking`, `id`, `${id}`),
        );

      if (booking.user_id['id'] == id) return true;
      return false;
    }
  }

  getRequestProperties(request: any) {
    const { id, isAdmin } = request.currentUser;
    const { body } = request;
    const { method } = request;

    return { id, isAdmin, body, method };
  }

  ifUserWeAreAccessingIsCurrentUser({
    path,
    secondPath,
    id,
  }: {
    path: string;
    secondPath: string;
    id: string;
  }) {
    if (path === `user` && secondPath == id) return true;
  }

  ifBookingIsBeingCreatedByCurrentUser({
    path,
    secondPath,
    method,
    id,
    userId,
  }: {
    path: string;
    secondPath: string;
    method: string;
    id: string;
    userId: string;
  }) {
    if (
      path == controller.BOOKING_SEAT &&
      secondPath == controller_path.BOOKING_SEAT.BOOK_SEAT &&
      method == 'POST' &&
      id == userId
    )
      return true;
  }
}
