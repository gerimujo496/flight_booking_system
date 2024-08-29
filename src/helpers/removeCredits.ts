import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { errorMessage } from 'src/constants/errorMessages';
import { CreditDal } from 'src/credit/credit.dal';
import { UpdateCreditDto } from 'src/credit/dto/update-credit.dto';
import { UserDal } from 'src/user/user.dal';

@Injectable()
export class RemoveCredit {
  constructor(
    private creditDal: CreditDal,
    private userDal: UserDal,
  ) {}

  async removeCredits(id: number, value: number) {
    const credit = await this.creditDal.findOneByUserId(id);
    if (!credit)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`credit`, `id`, `${id}`),
      );

    if (credit.credits < value)
      throw new ForbiddenException(errorMessage.BALANCE_NOT_ENOUGH);

    const updateBody: UpdateCreditDto = { credits: credit.credits - value };

    const updatedResult = await this.creditDal.update(id, updateBody);
    if (!updatedResult)
      throw new InternalServerErrorException(
        errorMessage.INTERNAL_SERVER_ERROR(`remove`, `credit`),
      );

    const newCredit = await this.creditDal.findOneById(id);

    return newCredit;
  }
}
