import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CaptureEventController } from './captureEvent.controller'
import { CaptureEvent, CaptureEventSchema } from './captureEvent.schema'
import { CaptureEventService } from './captureEvent.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: CaptureEvent.name, schema: CaptureEventSchema }])],
  controllers: [CaptureEventController],
  providers: [CaptureEventService],
})
export class CaptureEventModule {}
