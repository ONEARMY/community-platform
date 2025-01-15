import { createContext } from 'react'

import type { DBProfile } from 'src/models/profile.model'

export const SessionContext = createContext<DBProfile | null>(null)
