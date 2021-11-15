import { Schema, model, Document, Types } from 'mongoose'

import { IBroker } from '@models/Broker'
import { IUser } from '@models/User'

export interface IProperty extends Document {
  broker: IBroker['_id']
  name: string
  created_by: IUser['_id']
}

const PropertySchema = new Schema(
  {
    broker: { type: Types.ObjectId, ref: 'Broker', required: true },
    name: { type: String, required: true },
    created_by: { type: Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'Property',
  }
)

// Indexes
PropertySchema.index({ name: 1 })

export default model<IProperty>('Property', PropertySchema)
