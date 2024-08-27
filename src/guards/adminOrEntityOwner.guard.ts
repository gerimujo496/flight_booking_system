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
    const currentUser = request.currentUser;
    if (currentUser.isAdmin) return currentUser.isAdmin;

    const paths: string[] = request.path.split('/');
    if (paths.length < 2) return false;

    const path = paths[1];
    const requestId = paths[2];

    if (path === `user` && requestId == currentUser.id) return true;

    return false;
  }
}
