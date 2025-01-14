import type { ILibrary, IResearchDB } from 'oa-shared'

export interface UserCreatedDocs {
  howtos: ILibrary.DB[]
  research: IResearchDB[]
}
