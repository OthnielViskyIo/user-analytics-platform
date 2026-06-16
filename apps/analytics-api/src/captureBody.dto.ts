import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CaptureBodyDTO {
  @ApiProperty({
    description: 'The custom name of the event',
    example: 'click',
  })
  @IsString()
  eventName: string

  // maybe I can get this in core based on tackingId?
  @ApiProperty({
    description: 'The ID of the user',
    example: 'user-123',
  })
  @IsString()
  userId: string

  @ApiProperty({
    description: 'The tracking ID',
    example: 'tracking-123',
  })
  @IsString()
  trackingId: string

  @ApiProperty({
    description: 'Properties sent from client',
    example: { exampleKey: 'exampleValue' },
  })
  properties: Record<string, any>
}
