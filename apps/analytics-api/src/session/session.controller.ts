import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('session')
@Controller('session')
export class SessionController {
  @ApiOperation({ summary: 'Initialize or retrieve an anonymous session' })
  @ApiResponse({ status: 200, description: 'Session initialized' })
  @Get('init')
  async initSession(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let sessionId = req.cookies['sessionId']

    if (!sessionId) {
      sessionId = uuidv4()
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      })
    }

    return { sessionId }
  }
}
