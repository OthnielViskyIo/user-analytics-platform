import { Inject, Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name)

  constructor(@Inject('ANALYTICS_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to Kafka...')
    this.kafkaClient.subscribeToResponseOf('analytics.user-engagement')
    this.kafkaClient.subscribeToResponseOf('analytics.unique-sessions')
    try {
      await this.kafkaClient.connect()
      this.logger.log('Successfully connected to Kafka')
    } catch (error) {
      this.logger.error('Failed to connect to Kafka', error)
      throw error
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from Kafka...')
    await this.kafkaClient.close()
  }

  getClient(): ClientKafka {
    return this.kafkaClient
  }
}
