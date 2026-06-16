import { Controller } from '@nestjs/common'
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices'

import { CaptureEvent } from './captureEvent.schema'
import { CaptureEventService } from './captureEvent.service'

@Controller()
export class CaptureEventController {
  constructor(private readonly captureEventService: CaptureEventService) {}

  @MessagePattern('analytics.capture') // Topic name
  async handleCaptureEvent(@Payload() payload: CaptureEvent, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage()
    const headers = context.getMessage().headers

    console.log('DAS kafka context originalMessage: ', originalMessage)
    console.log('DAS kafka context headers: ', headers)
    console.log('DAS payload: ', payload)

    await this.captureEventService.persistCapturedEvent(payload)
  }
}
