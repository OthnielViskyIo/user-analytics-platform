import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CaptureBodyDTO {
  @ApiProperty({
    description: 'The custom name of the event',
    example: 'click',
  })
  @IsString()
  @IsNotEmpty()
  eventName: string

  @ApiProperty({
    description: 'The tracking ID',
    example: 'tracking-123',
  })
  @IsString()
  @IsNotEmpty()
  trackingId: string

  @ApiProperty({
    description: 'Properties sent from client',
    example: { exampleKey: 'exampleValue' },
  })
  properties?: Record<string, any>
}
