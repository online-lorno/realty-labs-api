import mongoose from 'mongoose'

import config from '@config/mongo'

const client = async () => {
  await mongoose.connect(config.host, config?.options)
}

export default client
