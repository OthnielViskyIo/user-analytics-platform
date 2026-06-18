import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class UserEngagement {
  @Prop({ required: true })
  pathname: string

  @Prop({ required: true })
  timeSpent: number

  @Prop({ required: true })
  clickPath: string[]
}

export const UserEngagementSchema = SchemaFactory.createForClass(UserEngagement)
