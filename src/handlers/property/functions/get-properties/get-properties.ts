import 'source-map-support/register'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { success, error } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import Property from '@models/Property'
import mongoClient from '@services/mongo/client'

export const getProperties = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Connect to database
    await mongoClient.connect()

    // Get properties
    const properties = await Property.find()

    return success({
      message: 'Successfully retrieved properties',
      properties,
    })
  } catch (exception: any) {
    return error(exception)
  } finally {
    // Disconnect to database
    await mongoClient.disconnect()
  }
}

export const handler = middyfy(getProperties)
