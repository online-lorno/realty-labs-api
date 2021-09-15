import { Schema, model, Document, Types } from 'mongoose'

import { IUser } from '@models/User'

export interface IBroker extends Document {
  user: IUser['_id']
  name: string
  slug: string
}

const BrokerSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'Broker',
  }
)

// Indexes
BrokerSchema.index({ name: 1 })

export default model<IBroker>('Broker', BrokerSchema)
