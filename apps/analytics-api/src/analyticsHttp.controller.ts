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
    await this.kafkaClient.connect()
  }

  @Post()
  @ApiOperation({ summary: 'Expose capture as POST endpoint' })
  @ApiBody({ type: CaptureBodyDTO })
  @ApiResponse({
    status: 201,
    description: 'Correlation ID for tracking calls end-to-end.',
    type: CaptureResponseDTO,
  })
  async postCapture(
    @Body() body: CaptureBodyDTO,
    @Req() req: Request & MetaInformationType,
  ): Promise<CaptureResponseDTO> {
    const payload = JSON.stringify({
      ...body,
      correlationId: req.correlationId,
      createdAt: req.createdAt,
    })

    // fire-and-forget, meaning that I'm not expecting a direct response
    this.kafkaClient.emit('analytics.capture', payload)

    return { correlationId: req.correlationId }
  }
}
