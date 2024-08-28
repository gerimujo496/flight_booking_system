import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AdminOrEntityOwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      return false;
    }
    const { id, isAdmin } = request.currentUser;
    const { body } = request;
    if (isAdmin) return true;

    const paths: string[] = request.path.split('/');
    if (paths.length < 2) return false;

    const path = paths[1];
    const requestId = paths[2];

    if (path === `user` && requestId == id) return true;

    if (path == `booking-seat` && id == body.userId) return true;

    false;
  }
}
