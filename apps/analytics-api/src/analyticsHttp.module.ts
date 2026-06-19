import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AnalyticsMetaMiddleware } from './analyticsMeta.middleware'
import { AnalyticsHttpController } from './analyticsHttp.controller'
import { AnalyticsService } from './analytics.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'ANALYTICS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
            },
          },
        }),
        inject: [ConfigService],
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
