import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AnalyticsMetaMiddleware } from './analyticsMeta.middleware'
import { AnalyticsHttpController } from './analyticsHttp.controller'
import { AnalyticsService } from './analytics.service'

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
        },
      },
    ]),
  ],
  controllers: [AnalyticsHttpController],
  providers: [AnalyticsService],
})
export class AnalyticsHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnalyticsMetaMiddleware).forRoutes('*')
  }
}
