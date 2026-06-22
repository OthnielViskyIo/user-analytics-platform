import { Controller, UsePipes, ValidationPipe } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

import { UserEngagementService } from './userEngagement.service'

@Controller()
export class UserEngagementController {
  constructor(private readonly userEngagementService: UserEngagementService) {}

  @MessagePattern('analytics.user-engagement')
  @UsePipes(new ValidationPipe())
  getUserEngagement() {
    return this.userEngagementService.getUserEngagementStats()
  }

  @MessagePattern('analytics.unique-sessions')
  @UsePipes(new ValidationPipe())
  getUniqueSessionsOverTime(data: { measure: 'week' | 'month' | 'year' }) {
    return this.userEngagementService.getUniqueSessionsOverTime(data.measure)
  }
}
