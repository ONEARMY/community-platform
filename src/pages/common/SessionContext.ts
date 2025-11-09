import { createContext } from 'react'

import type { JwtPayload } from '@supabase/supabase-js'

export const SessionContext = createContext<JwtPayload | null>(null)
