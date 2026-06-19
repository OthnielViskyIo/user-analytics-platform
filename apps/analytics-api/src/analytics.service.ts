import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

import { CaptureBodyDTO } from './dto/captureBody.dto'
import { CaptureResponseDTO } from './dto/captureResponse.dto'
import { UserEngagementResponseDto } from './dto/userEngagementResponse.dto'

@Injectable()
export class AnalyticsService implements OnModuleInit {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.kafkaClient.subscribeToResponseOf('analytics.user-engagement')
    await this.kafkaClient.connect()
  }

  async captureEvent(
    body: CaptureBodyDTO,
    correlationId: string,
    createdAt: string,
  ): Promise<CaptureResponseDTO> {
    const payload = JSON.stringify({
      ...body,
      correlationId,
      createdAt,
    })

    // fire-and-forget
    this.kafkaClient.emit('analytics.capture', payload)

    return { correlationId }
  }

  async getUserEngagement(
    correlationId: string,
    createdAt: string,
  ): Promise<UserEngagementResponseDto> {
    const payload = JSON.stringify({
      correlationId,
      createdAt,
    })

    return await firstValueFrom<UserEngagementResponseDto>(
      this.kafkaClient.send('analytics.user-engagement', payload),
    )
  }
}
