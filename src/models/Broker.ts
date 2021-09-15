import { Schema, model, Document, Types } from 'mongoose'

import User from '@models/User'

export interface IBroker extends Document {
  user: Types.ObjectId
  name: string
  slug: string
}

const BrokerSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: User, required: true },
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
