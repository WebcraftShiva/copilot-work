import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  _id: Types.ObjectId;
}
