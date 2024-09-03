import { z } from 'zod';
import { CreateAirplaneSchema } from './create-airplane.dto';

export const UpdateAirplaneSchema = CreateAirplaneSchema.partial();

export type UpdateAirplaneDto = z.infer<typeof UpdateAirplaneSchema>;
