import type { IHowtoDB, IResearchDB } from 'oa-shared'

export interface UserCreatedDocs {
  howtos: IHowtoDB[]
  research: IResearchDB[]
}
