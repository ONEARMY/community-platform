import type { DifficultyLevel } from 'oa-shared';

const makeEntry = <T,>(value: T, label?: string) => {
  return { value, label: label || value };
};

export const TIME_OPTIONS = [
  makeEntry<string>('< 1 hour'),
  makeEntry<string>('< 5 hours'),
  makeEntry<string>('< 1 day'),
  makeEntry<string>('< 1 week'),
  makeEntry<string>('1-2 weeks'),
  makeEntry<string>('3-4 weeks'),
  makeEntry<string>('1+ months'),
];

export const DIFFICULTY_OPTIONS = [
  makeEntry<DifficultyLevel>('easy', 'Easy'),
  makeEntry<DifficultyLevel>('medium', 'Medium'),
  makeEntry<DifficultyLevel>('hard', 'Hard'),
  makeEntry<DifficultyLevel>('very-hard', 'Very Hard'),
];
