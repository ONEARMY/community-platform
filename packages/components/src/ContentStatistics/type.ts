import type { availableGlyphs } from '../Icon/types';

export interface IStatistic {
  icon: availableGlyphs;
  label: string;
  count: number;
  modalComponent?: (data?: any) => React.ReactElement<{ onClose?: () => void }>;
  onOpen?: () => Promise<any>;
}
