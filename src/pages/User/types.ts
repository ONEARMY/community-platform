import type { ILibrary, IResearchDB } from 'oa-shared'

export interface UserCreatedDocs {
  library: ILibrary.DB[]
  research: IResearchDB[]
}
