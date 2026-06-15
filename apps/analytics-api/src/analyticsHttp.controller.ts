import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { type PageViewEvent } from '@repo/analytics-core/dist/analytics.service'
import { ClientKafka } from '@nestjs/microservices'

@Controller('analytics')
export class AnalyticsHttpController {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.kafkaClient.subscribeToResponseOf('capture.pageView')
    await this.kafkaClient.connect()
  }

  @Post()
  @ApiOperation({ summary: 'Emit page view event' })
  @ApiResponse({
    status: 201,
    description:
      'Emits a page view event which captures the user, the page and time spent on the page.',
    type: 'Page view',
  })
  async postEvent(
    @Body() event: PageViewEvent,
  ) /* PageViewEvent will come from shared type package*/ {
    this.kafkaClient.emit('capture.pageView', event)
    return { status: 'sent' }
  }
}
