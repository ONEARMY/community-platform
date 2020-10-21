import { DBDoc } from 'src/models'

export interface IResearchItem {
  slug: string
}
export type IResearchItemDB = IResearchItem & DBDoc
