import 'source-map-support/register'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Types } from 'mongoose'

import { success, error, errorResponse, StatusCode } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import Property from '@models/Property'
import mongoClient from '@services/mongo/client'

export const getSingleProperty = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Connect to database
    await mongoClient.connect()

    const id: string = event.pathParameters?.id || ''

    // Get single property
    const property = await Property.findById(new Types.ObjectId(id))

    // Check property
    if (!property) {
      throw errorResponse('Property is not existing', StatusCode.NOT_FOUND)
    }

    return success({
      message: 'Successfully retrieved property',
      property,
    })
  } catch (exception: any) {
    return error(exception)
  } finally {
    // Disconnect to database
    await mongoClient.disconnect()
  }
}

export const handler = middyfy(getSingleProperty)
