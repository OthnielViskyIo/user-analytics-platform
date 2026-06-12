import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AnalyticsModule } from './analytics.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AnalyticsModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user-analytics',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-analytics-consumer',
      },
    },
  })

  await app.listen()
}

bootstrap()
