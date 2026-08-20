import { createContext } from 'react-router';

export type Session = {
  authId: string;
  profileId: number | null;
  username: string | null;
  roles: string[];
} | null;

export const sessionContext = createContext<Session>(null);
