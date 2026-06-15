import { Controller } from '@nestjs/common'
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices'

/** TODO: this type will have to come from a place where the types used in the app can have a single
 * source of truth. Currently the issue is that I'll have these types defined, I'll have mongoose
 * schemas defined and I'll also have DTOs defined. Maybe I could combine these using zod together with
 * zod-mongoose and maybe also zod-to-ts
 **/
export type PageViewEvent = {
  userId: string
  url: string
  pageEnter: string // ISO date string
  pageLeave: string // ISO date string
  createdAt: string // ISO date string
}

@Controller()
export class AnalyticsController {
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
