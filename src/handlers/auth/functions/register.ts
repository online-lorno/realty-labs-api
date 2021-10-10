import 'source-map-support/register'
import type { FromSchema } from 'json-schema-to-ts'
import Ajv, { JSONSchemaType } from 'ajv'

import { returnAjvError } from '@libs/ajv'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { success, error, errorResponse, StatusCode } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import User, { UserType, UserLoginType } from '@models/User'
import mongoClient from '@services/mongo/client'
import schema from '../schemas/register'

type Body = FromSchema<typeof schema>
const bodySchema: JSONSchemaType<Body> = schema

const ajv = new Ajv()
const validate = ajv.compile(bodySchema)

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    // Connect to database
    await mongoClient.connect()

    // Validate fields
    if (!validate(event.body)) {
      returnAjvError(validate.errors)
    }

    // Expand passed data
    const { email, password, name, phone } = event.body

    // Check if user is existing
    const checkUser = await User.findOne({ email })
    if (checkUser) {
      throw errorResponse('Email is already taken.', StatusCode.BAD_REQUEST)
    }

    // Create user
    const user = await new User()
    user.email = email
    user.name = name
    user.type = UserType.Broker
    user.login_type = UserLoginType.email
    user.password = password
    user.phone = phone
    await user.save()

    // @TODO: Sent email to verify email address

    return success({
      message: 'Successfully registered',
    })
  } catch (exception: any) {
    console.log(exception)
    return error(exception)
  }
}

export const handler = middyfy(register)
