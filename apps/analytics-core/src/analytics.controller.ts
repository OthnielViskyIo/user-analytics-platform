import { Controller } from '@nestjs/common'
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices'

import { type PageViewEvent } from './analytics.service'

@Controller()
export class AnalyticsController {
  // constructor(private readonly appService: AppProcessor) {}

  @MessagePattern('capture.pageView') // Topic name
  handlePageView(@Payload() message: PageViewEvent, @Ctx() context: KafkaContext) {
    console.log('DAS kafka message sent by me: ', message)
    console.log('DAS kafka topic: ', context.getTopic())

    const originalMessage = context.getMessage()
    const partition = context.getPartition()
    const { headers, timestamp } = originalMessage

    console.log('DAS kafka original message: ', originalMessage)
    console.log('DAS kafka partition: ', partition)

    // TODO will write to db, or call the relevant method from service to do so

    return {
      headers: {
        ...headers,
        timestamp,
      },
      key: message.userId,
      value: message,
    }
  }
}
