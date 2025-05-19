import type { ILibrary, ResearchItem } from 'oa-shared'

export interface UserCreatedDocs {
  projects: ILibrary.DB[]
  research: Partial<ResearchItem>[]
}
