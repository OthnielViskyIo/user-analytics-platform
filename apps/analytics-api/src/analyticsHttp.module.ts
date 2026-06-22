import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AnalyticsMetaMiddleware } from './analyticsMeta.middleware'
import { AnalyticsHttpController } from './analyticsHttp.controller'
import { AnalyticsService } from './analytics.service'
import { KafkaModule } from './kafka/kafka.module'
import { HealthModule } from './health/health.module'
import { SessionModule } from './session/session.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
    HealthModule,
    SessionModule,
  ],
  controllers: [AnalyticsHttpController],
  providers: [AnalyticsService],
})
export class AnalyticsHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnalyticsMetaMiddleware).forRoutes('*')
  }
}
