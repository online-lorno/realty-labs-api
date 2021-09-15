import { MongoDbConfigProps } from './types'

const config: MongoDbConfigProps = {
  host: process.env.MONGODB_URI || '',
  options: {
    dbName: process.env.MONGODB_DB || 'realty-labs-dev',
    useNewUrlParser: true,
    useFindAndModify: false,
  },
}

export default config
