import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AnalyticsHttpModule } from './analyticsHttp.module'
import { HttpExceptionFilter } from './filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AnalyticsHttpModule)

  const configService = app.get(ConfigService)
  const corsAllowedOrigins = configService
    .get<string>(
      'CORS_ALLOWED_ORIGINS',
      'http://localhost:1351,http://localhost:1353,http://localhost:1355',
    )
    .split(',')

  app.enableCors({
    origin: corsAllowedOrigins,
    methods: 'GET,POST,OPTIONS,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    // credentials: true, // TODO: when we'll have cookies/auth
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())

  const options = new DocumentBuilder()
    .setTitle('Analytics API')
    .setDescription('User analytics platform')
    .setVersion('1.0')
    .addTag('analytics')
    // .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  const apiPort = configService.get<number>('API_PORT', 1351)
  await app.listen(apiPort)
  console.log(`Application is running on ${await app.getUrl()}`)
}

bootstrap()
