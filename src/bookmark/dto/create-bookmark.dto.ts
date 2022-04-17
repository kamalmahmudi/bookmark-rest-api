import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string

  @IsString()
  @IsOptional()
  readonly description?: string

  @IsString()
  @IsNotEmpty()
  readonly link: string
}
