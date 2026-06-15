import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AnalyticsModule } from './analytics.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AnalyticsModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'analytics',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'analytics-consumer',
      },
    },
  })

  await app.listen()
}

bootstrap()
