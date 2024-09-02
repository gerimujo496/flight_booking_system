import {
  PipeTransform,
  BadRequestException,
  HttpStatus,
  ArgumentMetadata,
} from '@nestjs/common';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log(value);
    try {
      if (typeof value != 'object' && metadata.type != 'custom') {
        return value;
      }

      const newValues = Object.assign({}, value);

      if (value['departure_time'] && value['arrival_time']) {
        newValues['departure_time'] = new Date(value['departure_time']);
        newValues['arrival_time'] = new Date(value['arrival_time']);
        if (newValues['arrival_time'] < newValues['departure_time'])
          throwError(
            HttpStatus.BAD_REQUEST,
            errorMessage.ARRIVAL_TIME_MUST_BE_AFTER,
          );
        return this.schema.parse(newValues);
      }
      //data['arrival_time'] > data['departure_time']
      if (value['departure_time']) {
        newValues['departure_time'] = new Date(value['departure_time']);

        return this.schema.parse(newValues);
      }

      if (value['arrival_time']) {
        newValues['arrival_time'] = new Date(value['arrival_time']);

        return this.schema.parse(newValues);
      }

      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
