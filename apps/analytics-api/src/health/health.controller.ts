import { Controller, Get } from '@nestjs/common'
import { HealthCheckService, HealthCheck, MicroserviceHealthIndicator } from '@nestjs/terminus'
import { Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.microservice.pingCheck('kafka', {
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
            },
          },
        }),
    ])
  }
}
