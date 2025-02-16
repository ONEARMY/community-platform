import { createContext } from 'react'

interface AuthorsContextType {
  authors: Array<number>
}

export const AuthorsContext = createContext<AuthorsContextType>({
  authors: [],
})
