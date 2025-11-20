import type { ReactElement } from 'react';

export interface DisplayData {
  icon: ReactElement;
  label: string;
  default: string;
}

export interface HideProp {
  hide: (target?: string) => void;
}
