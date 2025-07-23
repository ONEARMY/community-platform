import { createContext } from 'react'

interface MenusContextType {
  closeAll: () => void
}

export const MenusContext = createContext<MenusContextType>({
  closeAll: () => {},
})
