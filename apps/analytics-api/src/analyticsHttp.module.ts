import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AnalyticsMetaMiddleware } from './analyticsMeta.middleware'
import { AnalyticsHttpController } from './analyticsHttp.controller'

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
})
export class AnalyticsHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnalyticsMetaMiddleware).forRoutes('*')
  }
}
