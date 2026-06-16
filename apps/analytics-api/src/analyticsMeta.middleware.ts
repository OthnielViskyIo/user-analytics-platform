import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'

export type MetaInformationType = {
  correlationId: string
  createdAt: string
}

@Injectable()
export class AnalyticsMetaMiddleware implements NestMiddleware<Request & MetaInformationType> {
  use(req: Request & MetaInformationType, res: Response, next: NextFunction) {
    const incomingId = req.header('X-Correlation-Id')
    req.correlationId = incomingId || uuid()
    res.setHeader('X-Correlation-Id', req.correlationId)

    req.createdAt = new Date().toISOString()

    next()
  }
}
