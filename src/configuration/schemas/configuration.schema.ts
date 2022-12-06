import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';

@Schema({ timestamps: true, collection: 'configurations' })
export class ConfigurationDocument extends Document {
  @Prop({ required: true, index: true, unique: true, type: String })
  key: string;

  @Prop({ required: true, type: SchemaType.Types.Mixed })
  value: SchemaType.Types.Mixed;
}

export const ConfigurationSchema = SchemaFactory.createForClass(ConfigurationDocument);
