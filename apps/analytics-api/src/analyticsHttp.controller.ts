import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Request } from 'express'

import { MetaInformationType } from './analyticsMeta.middleware'
import { AnalyticsService } from './analytics.service'
import { CaptureBodyDTO } from './dto/captureBody.dto'
import { CaptureResponseDTO } from './dto/captureResponse.dto'
import { UserEngagementResponseDto } from './dto/userEngagementResponse.dto'
import { UniqueSessionsResponseDto } from './dto/uniqueSessionsResponse.dto'

@Controller('capture')
export class AnalyticsHttpController {
  constructor(private readonly analyticsService: AnalyticsService) {}

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
    const sessionId = req.cookies['sessionId']

    return await this.analyticsService.captureEvent(
      body,
      req.correlationId,
      req.createdAt,
      sessionId,
    )
  }

  @Get()
  @ApiOperation({ summary: 'User engagement metrics' })
  @ApiResponse({
    status: 200,
    description: 'User engagement object',
    type: UserEngagementResponseDto,
  })
  async getUserEngagement(@Req() req: Request & MetaInformationType) {
    const sessionId = req.cookies['sessionId']
    return await this.analyticsService.getUserEngagement(
      req.correlationId,
      req.createdAt,
      sessionId,
    )
  }

  @Get('sessions-over-time')
  @ApiOperation({ summary: 'Unique sessions over time' })
  @ApiQuery({ name: 'measure', enum: ['week', 'month', 'year'] })
  @ApiResponse({
    status: 200,
    description: 'Unique sessions over time',
    type: [UniqueSessionsResponseDto],
  })
  async getUniqueSessionsOverTime(@Query('measure') measure: 'week' | 'month' | 'year' = 'week') {
    return await this.analyticsService.getUniqueSessionsOverTime(measure)
  }
}
