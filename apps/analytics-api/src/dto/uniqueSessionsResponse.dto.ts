import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UniqueSessionsResponseDto {
  @ApiProperty({ description: 'The period for the measurement (e.g., 2024-06-22)' })
  @IsString()
  period: string

  @ApiProperty({ description: 'The number of unique sessions' })
  @IsNumber()
  count: number
}
