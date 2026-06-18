import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserEngagementController } from './userEngagement.controller'
import { UserEngagementService } from './userEngagement.service'
import { CaptureEvent, CaptureEventSchema } from '../capture-event/captureEvent.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: CaptureEvent.name, schema: CaptureEventSchema }])],
  controllers: [UserEngagementController],
  providers: [UserEngagementService],
})
export class UserEngagementModule {}
