import type { Project, Question, ResearchItem } from 'oa-shared'

export interface UserCreatedDocs {
  projects: Partial<Project>[]
  research: Partial<ResearchItem>[]
  questions: Partial<Question>[]
}
