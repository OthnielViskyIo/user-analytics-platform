import { IsString, IsNotEmpty, IsOptional, IsObject, IsDateString } from 'class-validator'

export class CaptureEventDto {
  @IsString()
  @IsNotEmpty()
  eventName: string

  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  trackingId: string

  @IsOptional()
  @IsObject()
  properties?: Record<string, any>

  @IsString()
  @IsNotEmpty()
  correlationId: string

  @IsDateString()
  createdAt: string
}
