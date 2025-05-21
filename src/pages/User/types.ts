import type { Project, ResearchItem } from 'oa-shared'

export interface UserCreatedDocs {
  projects: Partial<Project>[]
  research: Partial<ResearchItem>[]
}
