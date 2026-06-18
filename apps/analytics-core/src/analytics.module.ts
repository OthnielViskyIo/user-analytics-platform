import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CaptureEventModule } from './capture-event/captureEvent.module'
import { UserEngagementModule } from './user-engagement/userEngagement.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/user-analytics-db'),
    CaptureEventModule,
    UserEngagementModule,
  ],
})
export class AnalyticsModule {}
