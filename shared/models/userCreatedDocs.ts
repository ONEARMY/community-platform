import type { Project } from './library';
import type { Question } from './question';
import type { ResearchItem } from './research';

export type UserResearch = Partial<ResearchItem> & { fileDownloadCount?: number };

export interface UserCreatedDocs {
  projects: Partial<Project>[];
  research: UserResearch[];
  answers: Partial<Question>[];
}
