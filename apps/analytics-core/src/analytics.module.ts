import { Module } from '@nestjs/common'

import { AnalyticsController } from './analytics.controller'
import { AnalyticsEventService } from './analyticsEvent.service'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'my-producer-group', // producer's groupId // (??)
          },
        },
      },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsEventService],
})
export class AnalyticsModule {}
