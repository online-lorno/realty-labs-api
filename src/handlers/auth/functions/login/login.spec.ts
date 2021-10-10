import type { Context, Callback } from 'aws-lambda'
import faker from 'faker'
import { pick } from 'ramda'

import type { ValidatedAPIGatewayProxyEvent } from '@libs/apiGateway'
import User, { UserType, UserLoginType } from '@models/User'
import mongoClient from '@services/mongo/client'
import schema from '../../schemas/login'
import { login } from './login'

const context = {} as Context
const callback: Callback = (): void => {}
const body = {
  email: faker.internet.exampleEmail(),
  password: faker.internet.password(),
  name: faker.name.findName(),
  phone: faker.phone.phoneNumber(),
}

afterAll(async () => {
  await mongoClient.disconnect()
})

describe('POST /auth/login', () => {
  beforeAll(async () => {
    await mongoClient.connect()

    // Create user
    const user = await new User()
    user.email = body.email
    user.name = body.name
    user.type = UserType.Broker
    user.login_type = UserLoginType.email
    user.password = body.password
    user.phone = body.phone
    await user.save()

    await mongoClient.disconnect()
  })

  it('it should fail if body parameters are missing', async () => {
    const event = { body: {} } as ValidatedAPIGatewayProxyEvent<typeof schema>

    const response = await login(event, context, callback)
    if (response) {
      const { body: jsonBody, statusCode } = response
      const body = JSON.parse(jsonBody)
      expect(statusCode).toBe(400)
      expect(
        body?.error?.message.includes('must have required property')
      ).toBeTruthy()
    }
  })

  it('it should succeed if body parameters are existing', async () => {
    const event = {
      body: pick(['email', 'password'], body),
    } as ValidatedAPIGatewayProxyEvent<typeof schema>

    const response = await login(event, context, callback)
    if (response) {
      const { body: jsonBody, statusCode } = response
      const body = JSON.parse(jsonBody)
      expect(statusCode).toBe(200)
      expect(body?.message).toBe('Successfully logged in')
      expect(body?.token).not.toBeUndefined()
      expect(body?.token).not.toBeNull()
    }
  })

  it('it should fail if wrong password is used', async () => {
    const event = {
      body: {
        email: body.email,
        password: faker.internet.password(),
      },
    } as ValidatedAPIGatewayProxyEvent<typeof schema>

    const response = await login(event, context, callback)
    if (response) {
      const { body: jsonBody, statusCode } = response
      const body = JSON.parse(jsonBody)
      expect(statusCode).toBe(400)
      expect(body?.error?.message).toBe('Invalid email or password')
    }
  })

  it('it should fail if non-existing user credentials is used', async () => {
    const event = {
      body: {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
      },
    } as ValidatedAPIGatewayProxyEvent<typeof schema>

    const response = await login(event, context, callback)
    if (response) {
      const { body: jsonBody, statusCode } = response
      const body = JSON.parse(jsonBody)
      expect(statusCode).toBe(400)
      expect(body?.error?.message).toBe('Invalid email or password')
    }
  })
})
