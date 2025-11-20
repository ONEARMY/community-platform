import type { Project } from './library';
import type { Question } from './question';
import type { ResearchItem } from './research';

export interface UserCreatedDocs {
  projects: Partial<Project>[];
  research: Partial<ResearchItem>[];
  questions: Partial<Question>[];
}
