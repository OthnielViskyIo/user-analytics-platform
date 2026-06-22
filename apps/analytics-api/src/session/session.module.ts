import { Module } from '@nestjs/common'
import { SessionController } from './session.controller'

@Module({
  controllers: [SessionController],
  exports: [SessionController],
})
export class SessionModule {}
