import { format } from 'date-fns'
import { randomUUID } from 'crypto'

export const generateDatabasePrefix = () =>
  'db_' + format(new Date(), 'YYYYMMDD') + '_' + randomUUID()
