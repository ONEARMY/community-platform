import type { ILibrary, Question, ResearchItem } from 'oa-shared'

export interface UserCreatedDocs {
  projects: ILibrary.DB[]
  research: Partial<ResearchItem>[]
  questions: Partial<Question>[]
}
