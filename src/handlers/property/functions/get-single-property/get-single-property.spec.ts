import type { APIGatewayProxyEvent } from 'aws-lambda'
import faker from 'faker'
import { Types } from 'mongoose'

import { StatusCode } from '@libs/apiGateway'
import Property, { IProperty } from '@models/Property'
import mongoClient from '@services/mongo/client'
import { getSingleProperty } from './get-single-property'

const data = {
  broker: new Types.ObjectId(),
  name: faker.address.streetAddress(),
  created_by: new Types.ObjectId(),
}

afterAll(async () => {
  await mongoClient.disconnect()
})

describe('GET /property/{id}', () => {
  let id = ''

  beforeAll(async () => {
    await mongoClient.connect()

    // Create property
    const property = await new Property()
    property.broker = data.broker
    property.name = data.name
    property.created_by = data.created_by
    await property.save()

    id = property._id.toString()

    await mongoClient.disconnect()
  })

  it('it should fail when using a non-existing id', async () => {
    const event = {
      pathParameters: {
        id: faker.datatype.number({ min: 100000, max: 999999 }),
      },
    } as unknown as APIGatewayProxyEvent

    const response = await getSingleProperty(event)
    if (response) {
      const { body: jsonBody, statusCode } = response
      const body = JSON.parse(jsonBody)
      expect(statusCode).toBe(StatusCode.NOT_FOUND)
      expect(body?.error?.message).toBe('Property is not existing')
    }
  })

  it('it should succeed when using an existing id', async () => {
    const event = {
      pathParameters: {
        id,
      },
    } as unknown as APIGatewayProxyEvent

    const response = await getSingleProperty(event)
    if (response) {
      const { body: jsonBody, statusCode } = response
      const body = JSON.parse(jsonBody)
      expect(statusCode).toBe(StatusCode.OK)
      expect(body?.message).toBe('Successfully retrieved property')

      const property: IProperty = body?.property
      expect(property).toHaveProperty('broker')
      expect(property).toHaveProperty('name')
      expect(property).toHaveProperty('created_by')
      expect(property.broker).toBe(data.broker.toHexString())
      expect(property.name).toBe(data.name)
      expect(property.created_by).toBe(data.created_by.toHexString())
    }
  })
})
