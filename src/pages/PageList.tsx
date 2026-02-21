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

export const getAvailablePageList = (supportedModules: MODULE[]): IPageNavigation[] => {
  return COMMUNITY_PAGES.filter((pageItem) => supportedModules.includes(pageItem.module));
};

export const COMMUNITY_PAGES: IPageNavigation[] = [news, library, maps, academy, ResearchModule, QuestionModule];
