import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CaptureEvent } from './captureEvent.schema'

@Injectable()
export class CaptureEventService {
  constructor(
    @InjectModel('CaptureEvent') private readonly captureEventModel: Model<CaptureEvent>,
  ) {}

  async persistCapturedEvent(capturedEvent: CaptureEvent) {
    await this.captureEventModel.insertOne({
      ...capturedEvent,
    })
  }
}
