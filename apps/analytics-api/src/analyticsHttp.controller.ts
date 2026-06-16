import { Body, Controller, Inject, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { ClientKafka } from '@nestjs/microservices'
import { Request } from 'express'

import { CaptureResponseDTO } from './captureResponse.dto'
import { MetaInformationType } from './analyticsMeta.middleware'
import { CaptureBodyDTO } from './captureBody.dto'

@Controller('capture')
export class AnalyticsHttpController {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.kafkaClient.subscribeToResponseOf('analytics.capture')
    await this.kafkaClient.connect()
  }

  @Post()
  @ApiOperation({ summary: 'Emit capture event' })
  @ApiBody({ type: CaptureBodyDTO })
  @ApiResponse({
    status: 201,
    description: "Emits a capture event which let's the client track user activity.",
    type: CaptureResponseDTO,
  })
  async postEvent(
    @Body() event: CaptureBodyDTO,
    @Req() req: Request & MetaInformationType,
  ): Promise<CaptureResponseDTO> {
    this.kafkaClient.emit('analytics.capture', {
      ...event,
      correlationId: req.correlationId,
      createdAt: req.createdAt,
    })

    // TODO: better return types with proper status codes
    return { correlationId: req.correlationId }
  }
}
