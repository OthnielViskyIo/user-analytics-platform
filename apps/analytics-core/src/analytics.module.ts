import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CaptureEventModule } from './capture-event/captureEvent.module'

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/user-analytics-db'), CaptureEventModule],
})
export class AnalyticsModule {}
