import { MODULE } from 'src/modules';

interface IPageNavigation {
  module: MODULE;
  path: string;
  title: string;
}

const QuestionModule: IPageNavigation = {
  module: MODULE.QUESTIONS,
  path: '/questions',
  title: 'Questions',
};

const ResearchModule: IPageNavigation = {
  module: MODULE.RESEARCH,
  path: '/research',
  title: 'Research',
};

const library: IPageNavigation = {
  module: MODULE.LIBRARY,
  path: '/library',
  title: 'Library',
};
const academy: IPageNavigation = {
  module: MODULE.ACADEMY,
  path: '/academy',
  title: 'Academy',
};

const maps: IPageNavigation = {
  module: MODULE.MAP,
  path: '/map',
  title: 'Map',
};

const news: IPageNavigation = {
  module: MODULE.NEWS,
  path: '/news',
  title: 'News',
};

export const getAvailablePageList = (
  supportedModules: MODULE[],
  hiddenModules?: string,
): IPageNavigation[] => {
  const hidden = hiddenModules ? hiddenModules.split(',').map((s) => s.trim()) : [];
  return COMMUNITY_PAGES.filter(
    (pageItem) => supportedModules.includes(pageItem.module) && !hidden.includes(pageItem.module),
  );
};

export const COMMUNITY_PAGES: IPageNavigation[] = [
  news,
  library,
  maps,
  academy,
  ResearchModule,
  QuestionModule,
];

export type NavGlyph =
  | 'nav-updates'
  | 'nav-academy'
  | 'nav-projects'
  | 'nav-map'
  | 'nav-questions'
  | 'nav-library'
  | 'nav-research';

export interface INavLeaf {
  module: MODULE;
  path: string;
  title: string;
  icon: NavGlyph;
  description?: string;
}

export interface INavGroup {
  id: string;
  title: string;
  icon: NavGlyph;
  children: INavLeaf[];
}

export type INavEntry = { kind: 'leaf'; leaf: INavLeaf } | { kind: 'group'; group: INavGroup };

const NAVIGATION: INavEntry[] = [
  {
    kind: 'leaf',
    leaf: { module: MODULE.NEWS, path: '/news', title: 'Updates', icon: 'nav-updates' },
  },
  {
    kind: 'leaf',
    leaf: { module: MODULE.ACADEMY, path: '/academy', title: 'Academy', icon: 'nav-academy' },
  },
  {
    kind: 'group',
    group: {
      id: 'projects',
      title: 'Projects',
      icon: 'nav-projects',
      children: [
        {
          module: MODULE.LIBRARY,
          path: '/library',
          title: 'Library',
          icon: 'nav-library',
          description: 'Finished community projects',
        },
        {
          module: MODULE.RESEARCH,
          path: '/research',
          title: 'Research',
          icon: 'nav-research',
          description: 'Ongoing experiments',
        },
      ],
    },
  },
  {
    kind: 'leaf',
    leaf: { module: MODULE.MAP, path: '/map', title: 'Map', icon: 'nav-map' },
  },
  {
    kind: 'leaf',
    leaf: {
      module: MODULE.QUESTIONS,
      path: '/questions',
      title: 'Questions',
      icon: 'nav-questions',
    },
  },
];

export const getNavigation = (supportedModules: MODULE[], hiddenModules?: string): INavEntry[] => {
  const hidden = hiddenModules ? hiddenModules.split(',').map((s) => s.trim()) : [];
  const isVisible = (module: MODULE) =>
    supportedModules.includes(module) && !hidden.includes(module);

  return NAVIGATION.flatMap((entry): INavEntry[] => {
    if (entry.kind === 'leaf') {
      return isVisible(entry.leaf.module) ? [entry] : [];
    }
    const children = entry.group.children.filter((child) => isVisible(child.module));
    if (children.length === 0) {
      return [];
    }
    if (children.length === 1) {
      return [{ kind: 'leaf', leaf: children[0] }];
    }
    return [{ kind: 'group', group: { ...entry.group, children } }];
  });
};
