import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

import { KafkaService } from './kafka/kafka.service'
import { CaptureBodyDTO } from './dto/captureBody.dto'
import { CaptureResponseDTO } from './dto/captureResponse.dto'
import { UserEngagementResponseDto } from './dto/userEngagementResponse.dto'

@Injectable()
export class AnalyticsService {
  constructor(private readonly kafkaService: KafkaService) {}

  async captureEvent(
    body: CaptureBodyDTO,
    correlationId: string,
    createdAt: string,
    sessionId?: string,
  ): Promise<CaptureResponseDTO> {
    const payload = JSON.stringify({
      ...body,
      correlationId,
      createdAt,
      sessionId,
    })

    // fire-and-forget
    this.kafkaService.getClient().emit('analytics.capture', payload)

    return { correlationId }
  }

  async getUserEngagement(
    correlationId: string,
    createdAt: string,
    sessionId?: string,
  ): Promise<UserEngagementResponseDto> {
    const payload = JSON.stringify({
      correlationId,
      createdAt,
      sessionId,
    })

    return await firstValueFrom<UserEngagementResponseDto>(
      this.kafkaService.getClient().send('analytics.user-engagement', payload),
    )
  }
}
