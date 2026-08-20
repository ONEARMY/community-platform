import { createContext } from 'react-router';

export type Session = {
  authId: string;
  roles: string[];
} | null;

export const sessionContext = createContext<Session>(null);
