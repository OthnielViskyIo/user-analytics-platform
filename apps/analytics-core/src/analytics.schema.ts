import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class PageViewMessage {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  url: string

  @Prop({ required: true })
  timeSpent: number
}

export const PageViewMessageSchema = SchemaFactory.createForClass(PageViewMessage)
