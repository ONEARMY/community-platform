import { describe, expect, it } from 'vitest';
import { resolveType } from './contentType.utils';

describe('resolveType', () => {
  it('should resolve "project" to "projects"', () => {
    expect(resolveType('project')).toBe('projects');
  });

  it('should resolve "research_update" to "research_updates"', () => {
    expect(resolveType('research_update')).toBe('research_updates');
  });

  it('should return the input as is for unknown types', () => {
    expect(resolveType('unknown')).toBe('unknown');
  });
});
