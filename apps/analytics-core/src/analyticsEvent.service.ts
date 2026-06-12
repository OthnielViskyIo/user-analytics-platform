import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

type UserClickEvent = {
  userId: string
  url: string
}

@Injectable()
export class AnalyticsEventService implements OnModuleInit {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('capture.user.click')
    await this.kafkaClient.connect()
  }

  emitUserClickEvent(event: UserClickEvent) {
    this.kafkaClient.emit('capture.user.click', event)
  }
}
