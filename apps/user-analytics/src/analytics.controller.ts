import { Controller } from '@nestjs/common'
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices'

type CaptureClickMessage = {
  userId: string
  clickTime: number
}

@Controller('analytics')
export class AnalyticsController {
  // constructor(private readonly appService: AppProcessor) {}

  @MessagePattern('capture.user.click') // Topic name
  captureClick(@Payload() message: CaptureClickMessage, @Ctx() context: KafkaContext) {
    const userId = message.userId
    console.log('DAS userId in captureClick: ', userId)
    console.log('DAS kafka topic: ', context.getTopic())

    const originalMessage = context.getMessage()
    const partition = context.getPartition()
    const { headers, timestamp } = originalMessage

    console.log('DAS kafka original message: ', originalMessage)
    console.log('DAS kafka partition: ', partition)

    return {
      headers: {
        ...headers,
        timestamp,
      },
      key: userId,
      value: 'some value',
    }
  }
}
