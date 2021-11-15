import type { APIGatewayProxyEvent } from 'aws-lambda'
import faker from 'faker'
import { Types } from 'mongoose'

import { StatusCode } from '@libs/apiGateway'
import Property, { IProperty } from '@models/Property'
import mongoClient from '@services/mongo/client'
import { getProperties } from './get-properties'

const POPULATE_COUNT = 10

afterAll(async () => {
  await mongoClient.disconnect()
})

describe('GET /property', () => {
  const brokerId = new Types.ObjectId()
  const createdByid = new Types.ObjectId()

  beforeAll(async () => {
    await mongoClient.connect()

    // Create properties
    let i = 0
    while (i < POPULATE_COUNT) {
      const property = await new Property()
      property.broker = brokerId
      property.name = faker.address.streetAddress()
      property.created_by = createdByid
      await property.save()

      i++
    }

    await mongoClient.disconnect()
  })

  it('it should get a list of properties', async () => {
    const event = {} as APIGatewayProxyEvent

    const response = await getProperties(event)
    if (response) {
      const { body: jsonBody, statusCode } = response
      const body = JSON.parse(jsonBody)
      expect(statusCode).toBe(StatusCode.OK)
      expect(body?.message).toBe('Successfully retrieved properties')
      expect(body?.properties.length).toBe(POPULATE_COUNT)
      body?.properties.forEach((property: IProperty) => {
        expect(property).toHaveProperty('broker')
        expect(property).toHaveProperty('name')
        expect(property).toHaveProperty('created_by')
      })
    }
  })
})
