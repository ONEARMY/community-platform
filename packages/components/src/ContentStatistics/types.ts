import type { availableGlyphs } from '../Icon/types';

export type IStatistic = {
  icon: availableGlyphs;
  label: string;
  count: number;
  modalComponent?: (data?: any) => React.ReactElement<{ onClose?: () => void }>;
  onOpen?: () => Promise<any>;
};
