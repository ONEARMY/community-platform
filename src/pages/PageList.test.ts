import { describe, expect, it } from 'vitest';

import { MODULE } from 'src/modules';

import { getAvailablePageList, getNavigation } from './PageList';

describe('getAvailablePageList', () => {
  it('includes supported and not hidden modules', () => {
    const supported = [MODULE.LIBRARY, MODULE.QUESTIONS, MODULE.MAP];
    const result = getAvailablePageList(supported, 'questions');
    const modules = result.map((p) => p.module);

    expect(modules).toContain(MODULE.LIBRARY);
    expect(modules).toContain(MODULE.MAP);
  });

  it('excludes supported but hidden modules', () => {
    const supported = [MODULE.LIBRARY, MODULE.QUESTIONS, MODULE.MAP];
    const result = getAvailablePageList(supported, 'questions');
    const modules = result.map((p) => p.module);

    expect(modules).not.toContain(MODULE.QUESTIONS);
  });

  it('excludes unsupported modules even if hidden', () => {
    const supported = [MODULE.LIBRARY, MODULE.MAP];
    const result = getAvailablePageList(supported, 'questions');
    const modules = result.map((p) => p.module);

    expect(modules).not.toContain(MODULE.QUESTIONS);
  });
});

const ALL_MODULES = [
  MODULE.NEWS,
  MODULE.ACADEMY,
  MODULE.LIBRARY,
  MODULE.RESEARCH,
  MODULE.MAP,
  MODULE.QUESTIONS,
];

const titles = (nav: ReturnType<typeof getNavigation>) =>
  nav.map((entry) => (entry.kind === 'leaf' ? entry.leaf.title : entry.group.title));

describe('getNavigation', () => {
  it('returns the leaves and the Projects group in order when every module is supported', () => {
    const nav = getNavigation(ALL_MODULES);

    expect(titles(nav)).toEqual(['Updates', 'Academy', 'Projects', 'Map', 'Questions']);

    const projects = nav.find((entry) => entry.kind === 'group');
    expect(projects).toBeDefined();
    if (projects?.kind === 'group') {
      expect(projects.group.children.map((child) => child.title)).toEqual(['Library', 'Research']);
    }
  });

  it('drops a leaf whose module is not supported', () => {
    const nav = getNavigation([MODULE.NEWS, MODULE.ACADEMY, MODULE.QUESTIONS]);

    expect(titles(nav)).toEqual(['Updates', 'Academy', 'Questions']);
  });

  it('renders a single supported group child as a top-level leaf, not a dropdown', () => {
    const nav = getNavigation([MODULE.LIBRARY]);

    expect(titles(nav)).toEqual(['Library']);
    expect(nav.some((entry) => entry.kind === 'group')).toBe(false);

    const [entry] = nav;
    if (entry.kind === 'leaf') {
      expect(entry.leaf.module).toBe(MODULE.LIBRARY);
    }
  });

  it('collapses the Projects group to a Research leaf when only Research is supported', () => {
    const nav = getNavigation([MODULE.ACADEMY, MODULE.RESEARCH]);

    expect(titles(nav)).toEqual(['Academy', 'Research']);
    expect(nav.some((entry) => entry.kind === 'group')).toBe(false);
  });

  it('drops the Projects group entirely when none of its children are visible', () => {
    const nav = getNavigation([MODULE.NEWS, MODULE.MAP]);

    expect(titles(nav)).toEqual(['Updates', 'Map']);
    expect(nav.some((entry) => entry.kind === 'group')).toBe(false);
  });

  it('treats hiddenModules (comma-separated) as not visible', () => {
    const nav = getNavigation(ALL_MODULES, 'research, map');

    expect(titles(nav)).toEqual(['Updates', 'Academy', 'Library', 'Questions']);
    expect(nav.some((entry) => entry.kind === 'group')).toBe(false);
  });
});
