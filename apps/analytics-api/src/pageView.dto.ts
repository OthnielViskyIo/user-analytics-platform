import { IsString, IsDateString, IsDate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PageViewDTO {
  @ApiProperty({
    description: 'The ID of the user',
    example: 'user-123',
  })
  @IsString()
  userId: string

  @ApiProperty({
    description: 'The URL of the page',
    example: 'https://example.com/products/1',
  })
  @IsString()
  url: string

  @ApiProperty({
    description: 'The timestamp when the user entered the page (ISO format)',
    example: '2023-10-27T10:00:00.000Z',
  })
  @IsDateString()
  pageEnter: string

  @ApiProperty({
    description: 'The timestamp when the user left the page (ISO format)',
    example: '2023-10-27T10:05:00.000Z',
  })
  @IsDateString()
  pageLeave: string

  @ApiProperty({
    description: 'The timestamp when the event was created',
    example: '2023-10-27T10:05:01.000Z',
  })
  @IsDateString()
  createdAt: string
}
