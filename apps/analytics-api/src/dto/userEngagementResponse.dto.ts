import { IsObject } from 'class-validator'

export class UserEngagementResponseDto {
  @IsObject()
  pageviews: Record<string, number>

  @IsObject()
  timeOnPage: Record<string, number>
}
