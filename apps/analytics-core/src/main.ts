import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'
import { Partitioners } from 'kafkajs'

import { AnalyticsModule } from './analytics.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AnalyticsModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nestjs-consumer-client',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'analytics-consumer',
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  })

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen()
}

bootstrap()
