import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

export type PageViewEvent = {
  userId: string
  url: string
  pageEnter: string // ISO date string
  pageLeave: string // ISO date string
}

@Injectable()
export class AnalyticsService implements OnModuleInit {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka) {}

  /*async*/ onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('capture.pageView')
    // await this.kafkaClient.connect()
  }

  emitPageViewEvent(event: PageViewEvent) {
    this.kafkaClient.emit('capture.pageView', event)
  }
}
