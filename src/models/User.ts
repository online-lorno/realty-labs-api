import { Schema, model, Document } from 'mongoose'
import md5 from 'md5'

export enum UserType {
  Broker = 0,
  Agent = 1,
}

export enum UserLoginType {
  email = 0,
  facebook = 1,
  google = 2,
}

export interface IUser extends Document {
  email: string
  name: string
  type: UserType
  login_type: UserLoginType
  password?: string
  phone?: string
}

const UserSchema: Schema = new Schema(
  {
    // Main fields
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
      type: Number,
      enum: [UserType.Broker, UserType.Agent],
      required: true,
    },

    // Login fields
    login_type: {
      type: Number,
      enum: [UserLoginType.email, UserLoginType.facebook, UserLoginType.google],
      required: true,
    },
    password: { type: String },

    // Optional fields
    phone: { type: String },
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

export default model<IUser>('User', UserSchema)
