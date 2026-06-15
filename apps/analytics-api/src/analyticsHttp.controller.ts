import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { ClientKafka } from '@nestjs/microservices'

import { PageViewDTO } from './pageView.dto'

@Controller('analytics')
export class AnalyticsHttpController {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.kafkaClient.subscribeToResponseOf('capture.pageView')
    await this.kafkaClient.connect()
  }

  @Post()
  @ApiOperation({ summary: 'Emit page view event' })
  @ApiBody({ type: PageViewDTO })
  @ApiResponse({
    status: 201,
    description:
      'Emits a page view event which captures the user, the page and time spent on the page.',
    type: 'Page view',
  })
  async postEvent(@Body() event: PageViewDTO) {
    this.kafkaClient.emit('capture.pageView', event)

    // TODO: better return types with proper status codes
    return { status: 'sent' }
  }
}
