import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Transform(({ obj }) => {
    return obj.user_id.first_name;
  })
  @Expose()
  first_name: string;

  @Transform(({ obj }) => {
    return obj.user_id.last_name;
  })
  @Expose()
  last_name: string;

  @Transform(({ obj }) => {
    return obj.user_id.email;
  })
  @Expose()
  email: string;

  @Transform(({ obj }) => {
    return obj.user_id.country;
  })
  @Expose()
  country: string;

  @Expose()
  credits: string;
}
