import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class CaptureEvent {
  @Prop({ required: true, index: true })
  eventName: string

  @Prop({ required: true, index: true })
  userId: string

  @Prop({ required: true })
  trackingId: string

  @Prop({ required: false, type: Object })
  properties?: Record<string, any>

  @Prop({ required: true })
  correlationId: string

  @Prop({ required: true })
  createdAt: string
}

export const CaptureEventSchema = SchemaFactory.createForClass(CaptureEvent)

CaptureEventSchema.index({ 'properties.pathname': 1 })
