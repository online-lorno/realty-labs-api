import 'source-map-support/register'

import { success, error } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
// import Broker from '@models/Broker'
// import User, { UserType, UserLoginType } from '@models/User'
// import mongoClient from '@services/mongo/client'

const root = async () => {
  try {
    // await mongoClient.connect()

    // const user = await new User()
    // user.email = 'laput.leonard@gmail.com'
    // user.name = 'Leonard Laput'
    // user.type = UserType.Broker
    // user.login_type = UserLoginType.email
    // user.password = '11223344'
    // await user.save()

    // const users = await User.find()

    // const broker = await new Broker()
    // broker.user = users[0]._id
    // broker.name = 'Test Brokerage'
    // broker.slug = 'test-brokerage'
    // await broker.save()

    return success({
      message: 'Realty Labs API service',
      // user,
      // users,
      // broker,
    })
  } catch (exception: any) {
    console.log(exception)
    return error(exception)
  }
}

export const handler = middyfy(root)
