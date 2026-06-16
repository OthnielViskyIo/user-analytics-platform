import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CaptureResponseDTO {
  @ApiProperty({
    description: 'Correlation ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  correlationId: string
}
