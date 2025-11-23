import type { availableGlyphs } from '../Icon/types';

export type IStatistic = {
  icon: availableGlyphs;
  label: string;
  stat: number;
  modalComponent?: (data?: any) => React.ReactElement<{ onClose?: () => void }>;
  onOpen?: () => Promise<any>;
};
