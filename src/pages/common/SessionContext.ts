import type { JwtPayload } from '@supabase/supabase-js';
import { createContext } from 'react';

export const SessionContext = createContext<JwtPayload | null>(null);
