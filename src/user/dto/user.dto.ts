import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Transform(({ obj }) => {
    return obj.userId.firstName;
  })
  @Expose()
  firstName: string;

  @Transform(({ obj }) => {
    return obj.userId.lastName;
  })
  @Expose()
  lastName: string;

  @Transform(({ obj }) => {
    return obj.userId.email;
  })
  @Expose()
  email: string;

  @Transform(({ obj }) => {
    return obj.userId.country;
  })
  @Expose()
  country: string;

  @Expose()
  credits: string;
}
