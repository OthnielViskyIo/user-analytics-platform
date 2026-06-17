import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { CaptureEvent } from './captureEvent.schema'
import { CaptureEventService } from './captureEvent.service'

@Controller()
export class CaptureEventController {
  constructor(private readonly captureEventService: CaptureEventService) {}

  @MessagePattern('analytics.capture') // Topic name
  async handleCaptureEvent(@Payload() payload: CaptureEvent) {
    await this.captureEventService.persistCapturedEvent(payload)
  }
}
