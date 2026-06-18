import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ClientKafka } from '@nestjs/microservices'
import { Request } from 'express'
import { firstValueFrom } from 'rxjs'

import { MetaInformationType } from './analyticsMeta.middleware'
import { CaptureBodyDTO } from './dto/captureBody.dto'
import { CaptureResponseDTO } from './dto/captureResponse.dto'
import { UserEngagementResponseDto } from './dto/userEngagementResponse.dto'

@Controller('capture')
export class AnalyticsHttpController {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.kafkaClient.subscribeToResponseOf('analytics.user-engagement')
    await this.kafkaClient.connect()
  }

  @Post()
  @ApiOperation({ summary: 'Capture user activity as custom events' })
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

  @Get()
  @ApiOperation({ summary: 'User engagement metrics' })
  @ApiResponse({
    status: 200,
    description: 'User engagement object',
    type: UserEngagementResponseDto,
  })
  async getUserEngagement(@Req() req: Request & MetaInformationType) {
    const payload = JSON.stringify({
      correlationId: req.correlationId,
      createdAt: req.createdAt,
    })

    return await firstValueFrom<UserEngagementResponseDto>(
      this.kafkaClient.send('analytics.user-engagement', payload),
    )
  }
}
