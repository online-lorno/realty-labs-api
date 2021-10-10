import { Schema, model, Document, Types } from 'mongoose'
import md5 from 'md5'

import { IBroker } from '@models/Broker'

export enum UserType {
  Broker = 1,
  Agent = 2,
}

export enum UserLoginType {
  email = 1,
  facebook = 2,
  google = 3,
}

export interface IUser extends Document {
  email: string
  name: string
  type: UserType
  login_type: UserLoginType
  password?: string
  phone?: string
  email_activated: boolean
  broker?: IBroker['_id']
}

const UserSchema: Schema = new Schema<IUser>(
  {
    // Main fields
    email: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: Number,
      enum: Object.values(UserType).filter(
        (value) => typeof value === 'number'
      ),
      required: true,
    },

    // Login fields
    login_type: {
      type: Number,
      enum: Object.values(UserLoginType).filter(
        (value) => typeof value === 'number'
      ),
      required: true,
    },
    password: { type: String },

    // Other fields
    phone: { type: String },
    email_activated: { type: Boolean, required: true, default: false },
    broker: { type: Types.ObjectId, ref: 'Broker' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'User',
  }
)

// Middlewares
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = md5(this.password)
  }
  next()
})

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ email: 1, type: 1 })
UserSchema.index({ email: 1, login_type: 1 }, { unique: true })

export default model<IUser>('User', UserSchema)
