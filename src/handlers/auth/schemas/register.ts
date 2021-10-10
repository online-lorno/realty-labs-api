export default {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    name: { type: 'string' },
    phone: { type: 'string' },
  },
  required: ['email', 'password', 'name', 'phone'],
  additionalProperties: false,
} as const
