import type { availableGlyphs } from '../Icon/types'

export interface IStatistic {
  icon: availableGlyphs
  label: string
  modalComponent?: (data?: any) => JSX.Element
  onOpen?: () => Promise<any>
}
