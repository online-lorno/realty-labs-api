import 'source-map-support/register'

import { success, error } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

export const root = async () => {
  try {
    return success({
      message: 'Realty Labs API service',
    })
  } catch (exception: any) {
    return error(exception)
  }
}

export const handler = middyfy(root)
