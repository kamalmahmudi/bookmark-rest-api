import { PartialType } from '@nestjs/mapped-types'
import { CreateBookmarkDto } from './create-bookmark.dto'

export class EditBookmarkDto extends PartialType(CreateBookmarkDto) {}
