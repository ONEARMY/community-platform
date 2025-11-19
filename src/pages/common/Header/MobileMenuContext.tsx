import { createContext } from 'react';

interface MobileMenuContextType {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileMenuContext = createContext<MobileMenuContextType>({
  isVisible: false,
  setIsVisible: () => {},
});
