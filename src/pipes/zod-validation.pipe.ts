import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if (typeof value != 'object' && metadata.type != 'custom') {
        return value;
      }

      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
