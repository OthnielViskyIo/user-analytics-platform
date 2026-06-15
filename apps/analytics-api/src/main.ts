import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

import { AnalyticsHttpModule } from './analyticsHttp.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AnalyticsHttpModule)

  app.useGlobalPipes(new ValidationPipe())

  const options = new DocumentBuilder()
    .setTitle('Analytics API')
    .setDescription('User analytics platform')
    .setVersion('1.0')
    .addTag('analytics')
    // .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.API_PORT ?? 3000)
  console.log(`Application is running on ${await app.getUrl()}`)
}

bootstrap()
