import { Controller, UsePipes, ValidationPipe } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { CaptureEventService } from './captureEvent.service'
import { CaptureEventDto } from './captureEvent.dto'

@Controller()
export class CaptureEventController {
  constructor(private readonly captureEventService: CaptureEventService) {}

  @EventPattern('analytics.capture')
  @UsePipes(new ValidationPipe())
  async handleCaptureEvent(@Payload() payload: CaptureEventDto) {
    await this.captureEventService.persistCapturedEvent(payload)
  }
}
