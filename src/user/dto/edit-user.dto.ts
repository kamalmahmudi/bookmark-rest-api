import { IsEmail, IsOptional, IsString } from 'class-validator'

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  readonly email?: string

  @IsString()
  @IsOptional()
  readonly firstName?: string

  @IsString()
  @IsOptional()
  readonly lastName?: string
}
