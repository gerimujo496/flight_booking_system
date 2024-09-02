import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
      session: {
        userId?: number; // Adjust to your ID type
      };
    }
  }
}

/* eslint-enable @typescript-eslint/no-namespace */

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findByIdJoinWithCredits(userId);

      req.currentUser = user.user_id;
    }
    next();
  }
}
