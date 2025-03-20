import type { ILibrary } from 'oa-shared'
import type { ResearchItem } from 'src/models/research.model'

export interface UserCreatedDocs {
  projects: ILibrary.DB[]
  research: Partial<ResearchItem>[]
}
