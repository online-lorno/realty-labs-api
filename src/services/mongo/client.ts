import mongoose from 'mongoose'

import config from '@config/mongo'

const connect = async () => {
  await mongoose.connect(config.host, config?.options)
}

export default {
  connect,
}
